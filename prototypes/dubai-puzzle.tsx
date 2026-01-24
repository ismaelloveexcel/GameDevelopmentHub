import React from 'react';
import { View, Text } from 'react-native';
import { useGenie } from '../src/contexts/GenieContext';  // Tie into your Genie AI

const DubaiPuzzle = () => {
  const { genie } = useGenie();  // Use existing Genie for hints
  return (
    <View>
      <Text>Dubai Landmarks Puzzle - Polished by Agent!</Text>
      {/* Add Pixi.js canvas here for matching game */}
    </View>
  );
};

export default DubaiPuzzle;
