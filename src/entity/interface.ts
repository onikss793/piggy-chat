export interface IUser {
	id?: number;
	appleAccount?: string;
	kakaoAccount?: string;
	password?: string;
	phoneNumber?: string;
	nickname: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}
