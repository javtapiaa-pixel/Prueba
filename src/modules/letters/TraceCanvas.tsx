import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { PanResponder, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface TraceCanvasHandle {
  clear: () => void;
}

interface Props {
  size: number;
  color: string;
  onStrokeCountChange?: (count: number) => void;
}

const TraceCanvas = forwardRef<TraceCanvasHandle, Props>(({ size, color, onStrokeCountChange }, ref) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [liveDraft, setLiveDraft] = useState('');
  const draftRef = useRef('');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        draftRef.current = `M${locationX.toFixed(1)},${locationY.toFixed(1)}`;
        setLiveDraft(draftRef.current);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        draftRef.current += ` L${locationX.toFixed(1)},${locationY.toFixed(1)}`;
        setLiveDraft(draftRef.current);
      },
      onPanResponderRelease: () => {
        if (draftRef.current) {
          setPaths((prev) => {
            const next = [...prev, draftRef.current];
            onStrokeCountChange?.(next.length);
            return next;
          });
        }
        draftRef.current = '';
        setLiveDraft('');
      },
    })
  ).current;

  const clear = useCallback(() => {
    setPaths([]);
    draftRef.current = '';
    setLiveDraft('');
    onStrokeCountChange?.(0);
  }, [onStrokeCountChange]);

  useImperativeHandle(ref, () => ({ clear }), [clear]);

  return (
    <View style={{ width: size, height: size }} {...panResponder.panHandlers}>
      <Svg width={size} height={size}>
        {paths.map((d, i) => (
          <Path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {liveDraft ? (
          <Path
            d={liveDraft}
            stroke={color}
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </Svg>
    </View>
  );
});

TraceCanvas.displayName = 'TraceCanvas';

export default TraceCanvas;
