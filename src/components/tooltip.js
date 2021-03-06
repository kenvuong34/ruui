import React, { Component } from 'react';
import { Animated, StyleSheet, View, Text, Easing, } from 'react-native';
import { isString } from 'lodash';

import { connect, isWeb, directionSnap, directionAnimatedConfigs } from '../utils';
import type { Dimension, TooltipConfigs } from '../typeDefinition';

type Props = {
	tooltip?: {
		active?: Boolean,
		configs?: TooltipConfigs,
	},
	screenSize?: Dimension,
};

@connect(({ dimensions, tooltip }) => {
	return {
		screenSize: dimensions.window,
		tooltip,
	};
})

class RuuiTooltip extends Component {
	props: Props;

	constructor(props) {
		super(props);
		this.enterAnimation = new Animated.Value(0);
		this.state = {
			top: 0, left: 0,
		};
	}

	componentDidUpdate(previousProps, previousState, snapshot) {
		if (previousProps.tooltip.active !== this.props.tooltip.active) {
			this.container.measure((x, y, width, height) => {
				const { targetLayout, direction, positionSpacing } = this.props.tooltip.configs;

				this.setState(directionSnap(
					targetLayout.y, targetLayout.x,
					targetLayout.width, targetLayout.height,
					width, height,
					direction, positionSpacing,
				));

				Animated.timing(this.enterAnimation, {
					toValue: this.props.tooltip.active ? 1 : 0,
					duration: 500,
					easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
					useNativeDriver: false,
				}).start();
			});
		}
	}

	render() {
		const { tooltip, } = this.props;
		const { top, left, } = this.state;
		const animatedConfigs = directionAnimatedConfigs(tooltip.configs.direction, 10, this.enterAnimation);
		const innerStyles = animatedConfigs.borderRadius;
		const wrapperStyle = {
			top, left,
			transform: animatedConfigs.transform,
			opacity: animatedConfigs.opacity,
		};

		return <Animated.View pointerEvents="none" style={[styles.wrapper, wrapperStyle]}>
			<View ref={(instance) => { this.container = instance; }}>
				<Animated.View style={[styles.container, innerStyles, tooltip.configs.innerStyle]}>
					{this.renderContent()}
				</Animated.View>
			</View>
		</Animated.View>;
	}

	renderContent = () => {
		const { content } = this.props.tooltip.configs;

		if (isString(content)) {
			return <Text style={styles.title}>{content}</Text>;
		} else {
			return content;
		}
	};
}

export default RuuiTooltip;

export const styles = StyleSheet.create({
	wrapper: {
		position: isWeb ? 'fixed' : 'absolute',
	},
	container: {
		padding: 5, paddingHorizontal: 8,
		backgroundColor: 'rgb(97, 97, 97)',
		borderRadius: 3,
	},
	title: {
		fontSize: 11, fontWeight: '300',
		color: '#f5f5f5',
	},
});
