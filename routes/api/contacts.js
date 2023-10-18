import express from "express";
import Joi from "joi";
import Contact from "../../models/contact.js";
const router = express.Router();
const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

export const updateStatusContact = async (contactId, favorite) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );

    return updatedContact;
  } catch (error) {
    return null;
  }
};

router.patch("/:contactId/favorite", async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res, next) => {
  const result = await Contact.find();
  res.json(result);
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);

    if (!result) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/", async (req, res, next) => {
  const body = req.body;

  delete body.id;

  const { error } = contactSchema.validate(body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const result = await Contact.create(body);

  if (!result) {
    return res.status(500).json({
      message: "Server error",
    });
  }

  res.status(201).json(result);
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndRemove(contactId);

  if (!result) {
    return res.status(404).json({
      message: "Not found",
    });
  }

  res.status(200).json({
    message: "Contact deleted",
  });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;

  delete body.id;

  const { error } = contactSchema.validate(body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const result = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (!result) {
    return res.status(404).json({
      message: "Contact not found",
    });
  }

  res.status(200).json(result);
});
export default router;
