
export enum ToastType {
  Success = "Success",
  Error = "Error",
  Info = "Info",
  Warning = "Warning",
  Other = "",
}

export interface Toast {
  id: string;
  title: string;
  text: string;
  type: ToastType;
  expirationMillisecond: number;
  bootstrapClasses: string;
}
