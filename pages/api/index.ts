import { getDMMF } from "@prisma/sdk";
import { NextApiRequest, NextApiResponse } from "next";
import stripAnsi from "strip-ansi";

import { parseDMMFError } from "~/util";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const schema = req.body.schema as string;
    const dmmf = await getDMMF({ datamodel: schema });

    res.json(dmmf.datamodel);
  } catch (err) {
    const message = stripAnsi(err.message);
    console.error(message);
    const errors = parseDMMFError(message);

    res.status(400).json({ errors });
  }
}