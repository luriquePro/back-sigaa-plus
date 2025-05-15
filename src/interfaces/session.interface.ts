enum SESSION_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  FORCE_DISABLED = 'FORCE_DISABLED',
  CANCELED = 'CANCELED',
}

interface ISessionDTO {
  id: string;
  status: SESSION_STATUS;
  user: string;
  start_session: Date;
  end_session: Date;
}

interface ISessionCreateDTO {
  user: string;
  start_session: Date;
  end_session: Date;
}

interface ISessionModel extends Partial<Omit<Document, 'id'>>, ISessionDTO {}

export { SESSION_STATUS };
export type { ISessionCreateDTO, ISessionDTO, ISessionModel };
