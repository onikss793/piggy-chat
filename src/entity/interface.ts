export interface IUser {
	id?: number;
	appleAccount?: string;
	kakaoAccount?: string;
	password?: string;
	phoneNumber?: string;
	nickName: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}
