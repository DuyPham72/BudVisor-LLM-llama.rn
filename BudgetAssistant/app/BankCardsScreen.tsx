import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Button } from './components/button';
import { Card, CardContent } from './components/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/dialog';
import { Input } from './components/input';
import { Label } from './components/label';

interface BankCardsScreenProps {
  onBack: () => void;
  onOpenMenu: () => void;
}

interface BankCard {
  id: string;
  type: string;
  last4: string;
  colors: [string, string]; // we’ll just use colors[0] for solid bg
}

const INITIAL_CARDS: BankCard[] = [
  {
    id: '1',
    type: 'Visa',
    last4: '4532',
    colors: ['#3B82F6', '#1D4ED8'], // blue-ish
  },
  {
    id: '2',
    type: 'Mastercard',
    last4: '8921',
    colors: ['#8B5CF6', '#6D28D9'], // purple-ish
  },
  {
    id: '3',
    type: 'American Express',
    last4: '3782',
    colors: ['#22C55E', '#15803D'], // green-ish
  },
];

const RANDOM_GRADIENTS: [string, string][] = [
  ['#EF4444', '#B91C1C'], // red
  ['#6366F1', '#4338CA'], // indigo
  ['#EC4899', '#BE185D'], // pink
];

export const BankCardsScreen: React.FC<BankCardsScreenProps> = ({
  onBack,
  onOpenMenu,
}) => {
  const [cards, setCards] = useState<BankCard[]>(INITIAL_CARDS);
  const [open, setOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [cardType, setCardType] = useState('');

  const handleAddCard = () => {
    if (!newCardNumber || newCardNumber.length < 16) {
      Alert.alert('Invalid card', 'Please enter a valid card number.');
      return;
    }

    const last4 = newCardNumber.slice(-4);
    const colors =
      RANDOM_GRADIENTS[
        Math.floor(Math.random() * RANDOM_GRADIENTS.length)
      ];

    const newCard: BankCard = {
      id: Date.now().toString(),
      type: cardType || 'Visa',
      last4,
      colors,
    };

    setCards((prev) => [...prev, newCard]);
    setNewCardNumber('');
    setCardType('');
    setOpen(false);
    Alert.alert('Success', 'Card added successfully.');
  };

  const handleRemoveCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    Alert.alert('Removed', 'Card removed successfully.');
  };

  return (
    <View style={styles.container}>
      {/* Header: back + title + hamburger */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Bank Cards</Text>

        <TouchableOpacity onPress={onOpenMenu} style={styles.iconButton}>
          <Ionicons name="menu" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add Card Button */}
        <Button style={styles.addCardButton} onPress={() => setOpen(true)}>
          <View style={styles.addCardContent}>
            <Ionicons
              name="add"
              size={20}
              color="#FFFFFF"
              style={styles.addIcon}
            />
            <Text style={styles.addCardText}>Add New Card</Text>
          </View>
        </Button>

        {/* Add Card Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Card</DialogTitle>
              <DialogDescription>
                Link a new bank card to your account for tracking expenses.
              </DialogDescription>
            </DialogHeader>

            <View style={styles.dialogBody}>
              <View style={styles.fieldGroup}>
                <Label>Card Type</Label>
                <Input
                  placeholder="Visa, Mastercard, etc."
                  value={cardType}
                  onChangeText={setCardType}
                />
              </View>
              <View style={styles.fieldGroup}>
                <Label>Card Number</Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={newCardNumber}
                  onChangeText={(text) =>
                    setNewCardNumber(
                      text.replace(/\s/g, '').slice(0, 16),
                    )
                  }
                  keyboardType="number-pad"
                  maxLength={16}
                />
              </View>
              <Button style={styles.fullWidthButton} onPress={handleAddCard}>
                <Text style={styles.buttonText}>Add Card</Text>
              </Button>
            </View>
          </DialogContent>
        </Dialog>

        {/* Cards List */}
        <View style={styles.cardsList}>
          {cards.map((card) => (
            <Card key={card.id} style={[styles.cardWrapper, styles.noShadow]}>
              <CardContent style={styles.cardContent}>
                {/* Solid color instead of gradient */}
                <View
                  style={[
                    styles.cardBg,
                    { backgroundColor: card.colors[0] },
                  ]}
                >
                  <View style={styles.cardTopRow}>
                    {/* <MaterialCommunityIcons
                      name="credit-card-outline"
                      size={40}
                      color="#FFFFFF"
                    /> */}
                    <Button
                      variant="ghost"
                      style={styles.trashButton}
                      onPress={() => handleRemoveCard(card.id)}
                    >
                      {/* <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={20}
                        color="#FFFFFF"
                      /> */}
                    </Button>
                  </View>

                  <View style={styles.cardBottom}>
                    <Text style={styles.cardNumber}>
                      •••• •••• •••• {card.last4}
                    </Text>
                    <View style={styles.cardMetaRow}>
                      <Text style={styles.cardMetaText}>{card.type}</Text>
                      <Text style={styles.cardMetaText}>Exp: 12/27</Text>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  addCardButton: {
    width: '100%',
    backgroundColor: '#4F46E5',
  },
  addCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    marginRight: 8,
  },
  addCardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  dialogBody: {
    marginTop: 16,
    gap: 12,
  },
  fieldGroup: {
    gap: 4,
  },
  fullWidthButton: {
    marginTop: 8,
    width: '100%',
    alignSelf: 'stretch',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  cardsList: {
    marginTop: 12,
    gap: 12,
  },
  cardWrapper: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
  },
  cardContent: {
    padding: 0,
  },
  cardBg: {
    borderRadius: 16,
    padding: 16,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  noShadow: {
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  trashButton: {
    backgroundColor: 'transparent',
  },
  cardBottom: {
    gap: 12,
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    letterSpacing: 3,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardMetaText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
});
