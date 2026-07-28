export interface IChannels {
  dndAllChannels?: boolean;
  email?: boolean;
  extMessage?: boolean;
  callAndVoice?: boolean;
  inboundCallsAndSms?: boolean;
}

export interface IContact {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  profileUrl?: string;
  contactType?: string;
  timeZone?: string;
  channels?: IChannels;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  org?: string;
  createdBy?: string;
}

export interface IContactCreate {
  name?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  profileUrl?: string;
  contactType?: string;
  timeZone?: string;
  channels?: IChannels;
}

export interface IContactQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
//   serviceType?: string;
}

export interface IContactUpdate extends IContactCreate {}
