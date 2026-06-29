import Address from '../models/Address.js';

// @desc    Get all addresses for a user
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single address
// @route   GET /api/addresses/:id
// @access  Private
const getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (address) {
      res.json(address);
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
const createAddress = async (req, res) => {
  try {
    const { label, customLabel, phone, whatsapp, country, district, sector, cell, village, isDefault } = req.body;

    const address = await Address.create({
      user: req.user._id,
      label,
      customLabel,
      phone,
      whatsapp,
      country,
      district,
      sector,
      cell,
      village,
      isDefault: isDefault || false,
    });

    // If this is set as default, unset other default addresses
    if (address.isDefault) {
      await Address.updateMany(
        { user: req.user._id, _id: { $ne: address._id } },
        { isDefault: false }
      );
    }

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (address) {
      address.label = req.body.label || address.label;
      address.customLabel = req.body.customLabel || address.customLabel;
      address.phone = req.body.phone || address.phone;
      address.whatsapp = req.body.whatsapp || address.whatsapp;
      address.country = req.body.country || address.country;
      address.district = req.body.district || address.district;
      address.sector = req.body.sector || address.sector;
      address.cell = req.body.cell || address.cell;
      address.village = req.body.village || address.village;
      address.isDefault = req.body.isDefault !== undefined ? req.body.isDefault : address.isDefault;

      // If this is set as default, unset other default addresses
      if (address.isDefault) {
        await Address.updateMany(
          { user: req.user._id, _id: { $ne: address._id } },
          { isDefault: false }
        );
      }

      const updatedAddress = await address.save();
      res.json(updatedAddress);
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (address) {
      await address.deleteOne();
      res.json({ message: 'Address removed' });
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (address) {
      // Unset all other default addresses
      await Address.updateMany(
        { user: req.user._id },
        { isDefault: false }
      );

      // Set this as default
      address.isDefault = true;
      await address.save();

      res.json(address);
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
