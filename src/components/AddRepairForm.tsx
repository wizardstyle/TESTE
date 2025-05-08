import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRepairs, NewRepair } from '../hooks/useRepairs';

export const AddRepairForm = () => {
  const { addRepair } = useRepairs();
  const [formData, setFormData] = useState<NewRepair>({
    device_type: '',
    brand: '',
    model: '',
    problem_description: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    status: 'pending',
    estimated_cost: undefined,
    actual_cost: undefined,
  });

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.device_type || !formData.brand || !formData.model || 
          !formData.problem_description || !formData.customer_name) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      await addRepair(formData);
      
      // Reset form
      setFormData({
        device_type: '',
        brand: '',
        model: '',
        problem_description: '',
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        status: 'pending',
        estimated_cost: undefined,
        actual_cost: undefined,
      });

      Alert.alert('Success', 'Repair added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add repair');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Device Type *</Text>
        <TextInput
          style={styles.input}
          value={formData.device_type}
          onChangeText={(text) => setFormData({ ...formData, device_type: text })}
          placeholder="e.g., Smartphone, Laptop, Tablet"
        />

        <Text style={styles.label}>Brand *</Text>
        <TextInput
          style={styles.input}
          value={formData.brand}
          onChangeText={(text) => setFormData({ ...formData, brand: text })}
          placeholder="e.g., Apple, Samsung, Dell"
        />

        <Text style={styles.label}>Model *</Text>
        <TextInput
          style={styles.input}
          value={formData.model}
          onChangeText={(text) => setFormData({ ...formData, model: text })}
          placeholder="e.g., iPhone 13, Galaxy S21"
        />

        <Text style={styles.label}>Problem Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.problem_description}
          onChangeText={(text) => setFormData({ ...formData, problem_description: text })}
          placeholder="Describe the problem..."
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Customer Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.customer_name}
          onChangeText={(text) => setFormData({ ...formData, customer_name: text })}
          placeholder="Customer's full name"
        />

        <Text style={styles.label}>Customer Phone</Text>
        <TextInput
          style={styles.input}
          value={formData.customer_phone}
          onChangeText={(text) => setFormData({ ...formData, customer_phone: text })}
          placeholder="Phone number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Customer Email</Text>
        <TextInput
          style={styles.input}
          value={formData.customer_email}
          onChangeText={(text) => setFormData({ ...formData, customer_email: text })}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Estimated Cost</Text>
        <TextInput
          style={styles.input}
          value={formData.estimated_cost?.toString()}
          onChangeText={(text) => setFormData({ 
            ...formData, 
            estimated_cost: text ? parseFloat(text) : undefined 
          })}
          placeholder="Estimated cost"
          keyboardType="decimal-pad"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Repair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1E90FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 