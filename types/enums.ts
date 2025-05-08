export enum SignLanguage {
  BSL = "BSL",
  ASL = "ASL",
}

export enum UserRole {
  ADMIN = "ADMIN",
  TRANSLATOR = "TRANSLATOR",
  RESEARCHER = "RESEARCHER",
  APPROVER = "APPROVER",
  COMMERCIAL = "COMMERCIAL",
}

export enum SignTranslationStatus {
  UNSIGNED = "UNSIGNED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
}

export enum BackgroundSegmentationStatus {
  STARTED = "STARTED",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum LogType {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}
