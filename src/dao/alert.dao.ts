import { map } from 'ramda';
import type { IAlert } from '../model';
import { models } from '../mongo';

const { Alert } = models;

export const saveAlert = async (data: IAlert): Promise<IAlert> => {
  return (await Alert.create(data)).save();
};

export const saveAlerts = async (data: IAlert[]): Promise<IAlert[]> => {
  const createAlert = async (it: IAlert) => (await Alert.create(it)).save();
  return Promise.all(map(createAlert, data));
};
