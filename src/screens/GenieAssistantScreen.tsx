import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useGenie } from '../contexts/GenieContext';
import { GeniePersonality } from '../types';

const personalities: {
  type: GeniePersonality;
  name: string;
  icon: string;
  color: string;
  description: string;
}[] = [
  {
    type: 'creative',
    name: 'Creative Mentor',
    icon: 'palette',
    color: '#ec4899',
    description: 'Game design & storytelling',
  },
  {
    type: 'technical',
    name: 'Technical Expert',
    icon: 'code-braces',
    color: '#6366f1',
    description: 'Implementation & optimization',
  },
  {
    type: 'marketing',
    name: 'Marketing Guru',
    icon: 'chart-line',
    color: '#f59e0b',
    description: 'Promotion & monetization',
  },
  {
    type: 'educator',
    name: 'Educator',
    icon: 'school',
    color: '#10b981',
    description: 'Teaching & learning',
  },
];

export default function GenieAssistantScreen() {
  const { theme } = useTheme();
  const { personality, setPersonality, messages, sendMessage, isProcessing } = useGenie();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const currentPersonality = personalities.find((p) => p.type === personality);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim() && !isProcessing) {
      await sendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      {/* Personality Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.personalitySelector}
        contentContainerStyle={styles.personalitySelectorContent}
      >
        {personalities.map((p) => (
          <TouchableOpacity
            key={p.type}
            style={[
              styles.personalityChip,
              {
                backgroundColor: personality === p.type ? p.color + '20' : theme.colors.card,
                borderColor: personality === p.type ? p.color : 'transparent',
              },
            ]}
            onPress={() => setPersonality(p.type)}
          >
            <Icon
              name={p.icon}
              size={20}
              color={personality === p.type ? p.color : theme.colors.text}
            />
            <Text
              style={[
                styles.personalityName,
                {
                  color: personality === p.type ? p.color : theme.colors.text,
                },
              ]}
            >
              {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Current Personality Info */}
      <View style={[styles.currentPersonality, { backgroundColor: theme.colors.card }]}>
        <Icon name={currentPersonality?.icon || 'robot'} size={24} color={currentPersonality?.color} />
        <View style={styles.personalityInfo}>
          <Text style={[styles.personalityTitle, { color: theme.colors.text }]}>
            {currentPersonality?.name}
          </Text>
          <Text style={[styles.personalityDesc, { color: theme.colors.text + '80' }]}>
            {currentPersonality?.description}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="robot-excited" size={64} color={theme.colors.text + '40'} />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Hello! I'm Genie, your AI assistant.
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.text + '80' }]}>
              Ask me anything about game development!
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                {
                  backgroundColor:
                    message.role === 'user' ? theme.colors.primary : theme.colors.card,
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  {
                    color: message.role === 'user' ? '#fff' : theme.colors.text,
                  },
                ]}
              >
                {message.content}
              </Text>
              {message.codeSnippet && (
                <View style={[styles.codeContainer, { backgroundColor: theme.colors.background }]}>
                  <Text style={[styles.codeText, { color: theme.colors.text }]}>
                    {message.codeSnippet}
                  </Text>
                </View>
              )}
              {message.suggestions && message.suggestions.length > 0 && (
                <View style={styles.suggestions}>
                  {message.suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.suggestionChip, { borderColor: currentPersonality?.color }]}
                      onPress={() => setInputText(suggestion)}
                    >
                      <Text style={[styles.suggestionText, { color: currentPersonality?.color }]}>
                        {suggestion}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
        {isProcessing && (
          <View style={[styles.messageBubble, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.messageText, { color: theme.colors.text }]}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder="Ask me anything..."
          placeholderTextColor={theme.colors.text + '60'}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          editable={!isProcessing}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: inputText.trim() && !isProcessing ? currentPersonality?.color : theme.colors.text + '20',
            },
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isProcessing}
        >
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  personalitySelector: {
    maxHeight: 60,
  },
  personalitySelectorContent: {
    padding: 12,
  },
  personalityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
  },
  personalityName: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  currentPersonality: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
  personalityInfo: {
    marginLeft: 12,
    flex: 1,
  },
  personalityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  personalityDesc: {
    fontSize: 12,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  codeContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
  },
  suggestions: {
    marginTop: 8,
  },
  suggestionChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  suggestionText: {
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
