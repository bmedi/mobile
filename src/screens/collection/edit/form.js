import React from 'react'
import { Share, Alert } from 'react-native'
import { ThemeContext } from 'styled-components'
import PropTypes from 'prop-types'
import t from 't'

import { connect } from 'react-redux'
import { makeCollectionPath } from 'data/selectors/collections'
import { isPro } from 'data/selectors/user'

import { Form, Input, FormSection } from 'co/style/form'
import { SectionText } from 'co/style/section'
import Warning from 'co/common/alert/warning'
import Icon from 'co/common/icon'
import CollectionIcon from 'co/common/icon'
import Goto from 'co/common/goto'
import Toggle from 'co/common/toggle'

class CollectionForm extends React.PureComponent {
	static contextType = ThemeContext

	static propTypes = {
		_id: 		PropTypes.number,
		title: 		PropTypes.string,
		cover:		PropTypes.array,
		color:		PropTypes.string,
		public:		PropTypes.bool,
		parentId:	PropTypes.any,

		focus:		PropTypes.string,

		onChange: 	PropTypes.func,
		onSave:		PropTypes.func
	}

	static defaultProps = {
		focus:		''
	}

	onMoveTap = ()=>{
		this.props.navigation.navigate('path', {
			_id: this.props._id, 
			parentId: this.props.path[this.props.path.length-1]._id,
			onSelect: (parentId)=>{
				if (!this.props.isPro && Number.isInteger(parentId))
					return Alert.alert(t.s('nestedCollections') + ': ' + t.s('onlyInPro'))

				this.props.onChange({parentId})
			}
		})
	}

	onCoverTap = ()=>{
		this.props.navigation.navigate('cover', {
			color: this.props.color,
			onChange: this.props.onChange
		})
	}

	onPublicTap = ()=>
		this.props.onChange({public: !this.props.public})

	onShareTap = ()=>
		Share.share({
			url: 'https://raindrop.io/collection/'+this.props._id,
		})

	onChangeTitle = (text)=>
		this.props.onChange({title: text})

	renderOnlyPro = ()=>{
		if (!this.props.isPro && Number.isInteger(this.props.parentId))
			return (
				<Warning message={t.s('nestedCollections') + ': ' + t.s('onlyInPro')} />
			)
	}
	
	render() {
		const {
			_id,
			title,
			path,
			cover=[],
			children,
			parentId,
			onSave
		} = this.props

		let pathText = '', pathIcon = 'menu'

		if (path.length){
			pathText = path.map((p)=>p.title).join(' / ')

			if (Number.isInteger(parentId)){
				const lastPathItem = path[path.length-1]
				pathIcon = (
					<CollectionIcon 
						collectionId={lastPathItem._id} 
						src={Array.isArray(lastPathItem.cover) && lastPathItem.cover[0]} 
						size='list'
						color='accent' />
				)
			}
		}

		return (
			<React.Fragment>
				{this.renderOnlyPro()}
				
				{/*Title and description*/}
				<Form>
					<Input 
						heading
						autoFocus={this.props.focus=='title'}
						value={title}
						placeholder={t.s('enterTitle')}
						returnKeyType='done'
						onChangeText={this.onChangeTitle}
						onSubmitEditing={onSave} />

					<Goto
						last
						icon={<Icon collectionId={_id} src={cover[0]} size='list' />}
						label={t.s('icon')}
						onPress={this.onCoverTap} />
				</Form>
				
				<FormSection><SectionText>{t.s('properties')}</SectionText></FormSection>
				<Form>
					<Goto
						onPress={this.onMoveTap}
						icon={pathIcon}
						label={Number.isInteger(parentId) ? t.s('location') : t.s('group')}
						color='accent'
						subLabel={pathText} />

					<Toggle
						last={!this.props.public}
						icon={this.props.public ? 'lock-unlock' : 'lock'}
						color='purple'
						label={t.s('private')}
						value={!this.props.public}
						onChange={this.onPublicTap} />

					{this.props.public && _id && (
						<Goto
							last
							onPress={this.onShareTap}
							icon='global'
							label={t.s('share')}
							subLabel={t.s('access')+' '+t.s('accessViaLink').toLowerCase()} />
					)}
				</Form>

				{children}
			</React.Fragment>
		)
	}
}

export default connect(
	() => {
		const getCollectionPath = makeCollectionPath()
	
		return (state, { _id, parentId })=>({
			isPro: isPro(state),
			path: getCollectionPath(state, _id||parentId, {group:true, self: !_id})
		})
	},
	()=>({})
)(CollectionForm)