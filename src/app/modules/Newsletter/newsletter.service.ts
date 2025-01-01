import { Newsletter } from "@prisma/client";
import prisma from "../../shared/prisma";

const createNewsletterIntoDB = async (payload: Newsletter) => {
  const isExist = await prisma.newsletter.findFirst({
    where: {
      email: payload.email,
    },
  });

  //   If the email already exists in the database, then return null
  if (isExist) {
    return null;
  }

  const result = await prisma.newsletter.create({
    data: payload,
  });

  return result;
};

const getAllNewslettersFromDB = async () => {
  const result = await prisma.newsletter.findMany();

  return result;
};

export const NewsletterService = {
  createNewsletterIntoDB,
  getAllNewslettersFromDB,
};
