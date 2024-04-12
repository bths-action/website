import { NextRequest } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

export const endGiveaway = async (id: string) => {};

export const GET = async (req: NextRequest, { params: { id } }: Params) => {};
