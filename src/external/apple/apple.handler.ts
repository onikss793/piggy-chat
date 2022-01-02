import { Injectable } from '@nestjs/common';
import axios from 'axios';
import JwksRsa, * as jwksClient from 'jwks-rsa';
import { AppleJWKS } from './interface';

@Injectable()
export class AppleHandler {
	private readonly jwksUri: string;
	private readonly jwksClient: JwksRsa.JwksClient;

	constructor() {
		this.jwksUri = 'https://appleid.apple.com/auth/keys';
		this.jwksClient = jwksClient({ jwksUri: this.jwksUri })
	}

	async getJWKS(): Promise<AppleJWKS[]> {
		const { data } = await axios.get<AppleJWKS[]>(this.jwksUri);
		return data;
	}

	async getSigningKey(kid: string): Promise<jwksClient.SigningKey> {
		return this.jwksClient.getSigningKey(kid);
	}
}
