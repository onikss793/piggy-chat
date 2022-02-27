export interface ILoginDTO {
  id: string;
  jwt: string;
}

export interface IAppleLoginDTO {
	identity_token: string;
}

export interface IKakaoLoginDTO {
  access_token: string;
}
