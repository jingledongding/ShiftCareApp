import * as React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SimpleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  footer?: React.ReactNode;
}

export function SimpleDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
}: SimpleDialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
        onPress={() => onOpenChange(false)}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-background border-border rounded-lg border p-6 shadow-lg w-full max-w-sm"
        >
          <Text className="text-lg font-semibold text-foreground mb-2">
            {title}
          </Text>
          <Text className="text-sm text-muted-foreground mb-6">
            {description}
          </Text>
          {footer || (
            <Button onPress={() => onOpenChange(false)} className="w-full">
              <Text>OK</Text>
            </Button>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
