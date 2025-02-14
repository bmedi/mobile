import { useMemo } from 'react';
import { ThemeProvider } from 'styled-components/native'
import { TouchableNativeFeedback } from 'react-native-gesture-handler'

import { Wrap } from './style'
import { SectionView, SectionText } from 'co/style/section'
import Button from 'co/button'

export default function GroupView({ title, hidden, selected, selectable, onToggle, onItemPress, onMore, onAdd, dragState, status }) {
	const theme = useMemo(
		()=>({sectionActive: selected}),
		[selected]
	)

	return (
		<ThemeProvider theme={theme}>
			<TouchableNativeFeedback 
				onPress={selectable ? onItemPress : onToggle}>
				<Wrap dragState={dragState}>
					<SectionView>
						<SectionText>{title}</SectionText>

						{hidden && status!='empty' ? (
							<Button 
								icon='arrow-right-s'
								color={selected ? 'background.regular' : 'text.secondary'}
								onPress={onToggle} />
						) : (<>
							<Button 
								icon='add'
								color={status=='empty' ? 'accent' : (selected ? 'background.regular' : 'text.secondary')}
								onPress={onAdd} />

							{status!='empty' && (
								<Button 
									icon='more'
									color={selected ? 'background.regular' : 'text.secondary'}
									onPress={onMore} />
							)}
						</>)}
					</SectionView>
				</Wrap>
			</TouchableNativeFeedback>
		</ThemeProvider>
	)
}