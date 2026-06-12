import { IUser, formatUser } from "@/models/User";
import { IDoctorProfile, formatDoctorProfile } from "@/models/DoctorProfile";

export function doctorWithProfile(user: IUser, profile: IDoctorProfile) {
  return {
    user: formatUser(user),
    profile: formatDoctorProfile(profile),
  };
}
