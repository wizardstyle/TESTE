import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRepairs, Repair } from '../hooks/useRepairs';

const RepairItem = ({ repair, onStatusChange, onDelete }: {
  repair: Repair;
  onStatusChange: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFA500';
      case 'in_progress':
        return '#1E90FF';
      case 'completed':
        return '#32CD32';
      case 'cancelled':
        return '#FF0000';
      default:
        return '#808080';
    }
  };

  return (
    <View style={styles.repairItem}>
      <View style={styles.repairHeader}>
        <Text style={styles.deviceInfo}>{repair.brand} {repair.model}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(repair.status) }]}>
          <Text style={styles.statusText}>{repair.status}</Text>
        </View>
      </View>
      
      <Text style={styles.customerName}>{repair.customer_name}</Text>
      <Text style={styles.problemDescription}>{repair.problem_description}</Text>
      
      <View style={styles.costInfo}>
        {repair.estimated_cost && (
          <Text style={styles.costText}>Estimated: ${repair.estimated_cost}</Text>
        )}
        {repair.actual_cost && (
          <Text style={styles.costText}>Actual: ${repair.actual_cost}</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.statusButton]}
          onPress={() => onStatusChange(repair.id, 'in_progress')}
        >
          <Text style={styles.actionButtonText}>Update Status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(repair.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const RepairList = () => {
  const {
    repairs,
    loading,
    error,
    loadRepairs,
    updateRepairStatus,
    deleteRepair,
  } = useRepairs();

  useEffect(() => {
    loadRepairs();
  }, [loadRepairs]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={repairs}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <RepairItem
          repair={item}
          onStatusChange={updateRepairStatus}
          onDelete={deleteRepair}
        />
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  repairItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  repairHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceInfo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  customerName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  problemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  costInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  costText: {
    fontSize: 14,
    color: '#444',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusButton: {
    backgroundColor: '#1E90FF',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    textAlign: 'center',
  },
}); 