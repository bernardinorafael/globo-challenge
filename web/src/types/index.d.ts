export type User = {
  id: string
  name: string
  email: string
  created: Date
  updated: Date
}

export type Participant = {
  id: string
  name: string
  picture: string | null
  elimination_id: string | null
  created: Date
  updated: Date
}

export type Elimination = {
  id: string
  open: boolean
  participants: Pick<Participant, "id" | "name">[]
  start_date: Date
  end_date: Date
  created: Date
  updated: Date
}
