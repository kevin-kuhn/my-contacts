const ContactRepository = require('../repositories/ContactRepository');

class ContactController {
  async index(request, response) {
    const contacts = await ContactRepository.findAll();

    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;
    const contact = await ContactRepository.findById(id);

    if (!contact) {
      response.status(404).json({ error: 'Contact not found' });
      return;
    }

    response.json(contact);
  }

  async store(req, res) {
    const { name, email, phone, category_id } = req.body;

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email is required' });
      return;
    }

    const contactExists = await ContactRepository.findByEmail(email);

    if (contactExists) {
      res.status(400).json({ error: 'Contact already exists' });
      return;
    }

    const contact = await ContactRepository.create({
      name,
      email,
      phone,
      category_id,
    });

    res.json(contact);
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, email, phone, category_id } = req.body;

    const contactExists = await ContactRepository.findById(id);

    if (!contactExists) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email is required' });
      return;
    }

    const contactEmail = await ContactRepository.findByEmail(email);

    if (contactEmail && contactEmail.id !== id) {
      res.status(400).json({ error: 'Contact already exists' });
      return;
    }

    const contact = await ContactRepository.update(id, {
      name,
      email,
      phone,
      category_id,
    });

    res.json(contact);
  }

  async delete(request, response) {
    const { id } = request.params;
    const contact = await ContactRepository.findById(id);

    if (!contact) {
      response.status(404).json({ error: 'Contact not found' });
      return;
    }

    await ContactRepository.delete(id);
    response.sendStatus(204);
  }
}

// Singleton
module.exports = new ContactController();
