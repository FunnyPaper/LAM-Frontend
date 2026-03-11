export type ProfileDto = {
  email: string
}

export type GetProfileProvider = () => Promise<ProfileDto>
