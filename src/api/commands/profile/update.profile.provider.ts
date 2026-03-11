import type { ProfileDto } from "../../queries/profile.provider"

export type UpdateProfileDto = Partial<ProfileDto>
export type UpdateProfileProvider = (data: UpdateProfileDto) => Promise<void>