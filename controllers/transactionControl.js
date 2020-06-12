const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/v1/transactions
//@access   Public
exports.getTransactions = async (req, res, next) => {
  try {
    // Find all transactions
    const transactions = await Transaction.find();

    // Return success response with count and data
    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    // Return server error response
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Add transaction
// @route   POST /api/v1/transactions
//@access   Public
exports.addTransaction = async (req, res, next) => {
  try {
    // Destructure parsed body
    const { text, amount } = req.body;

    // Use request body on Transaction model
    const transaction = await Transaction.create(req.body);

    // Return success response and added data
    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    // If error is ValidationError
    if (err.name === 'ValidationError') {
      // Create error messages array
      const messages = Object.values(err.errors).map((val) => val.message);

      // Return user error response with messages
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      // Return server error response
      return res.status(500).json({
        success: false,
        error: 'Server Error',
      });
    }
  }
};

// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
//@access   Public
exports.deleteTransaction = async (req, res, next) => {
  try {
    // findById on request params ID
    const transaction = await Transaction.findById(req.params.id);

    // If transaction cannot be found, return 404 message
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'No transaction found',
      });
    }

    // If found, run remove method on resource
    await transaction.remove();

    // Return success response
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    // Return server error response
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};
