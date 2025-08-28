import api from '../../api/axios';

export type LeaveType = { id: string; code: string; name: string; isPaid: boolean };
export type LeaveRequest = {
  id: string;
  typeId: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
  createdAt: string;
};

export const getLeaveTypes = async (): Promise<LeaveType[]> => {
  const { data } = await api.get('/leaves/types');
  return data;
};

export const createLeave = async (payload: {
  typeId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}): Promise<LeaveRequest> => {
  const { data } = await api.post('/leaves', payload);
  return data;
};

export const myLeaves = async (): Promise<LeaveRequest[]> => {
  const { data } = await api.get('/leaves/my');
  return data;
};

export const cancelLeave = async (id: string): Promise<LeaveRequest> => {
  const { data } = await api.patch(`/leaves/${id}/cancel`, {});
  return data;
};

export const updateLeave = async (
  id: string,
  payload: { typeId: string; startDate: string; endDate: string; reason?: string }
): Promise<LeaveRequest> => {
  const { data } = await api.patch(`/leaves/${id}`, payload);
  return data;
};
