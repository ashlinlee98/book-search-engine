import { GraphQLResolveInfo } from 'graphql';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

const resolvers = {
  Query: {
    me: async (
      _parent: any,
      _args: any,
      context: { user: { _id: string } | null },
      _info: GraphQLResolveInfo
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return await User.findById(context.user._id).populate('savedBooks');
    },
  },
  Mutation: {
    login: async (
      _parent: any,
      { email, password }: { email: string; password: string },
      _context: any,
      _info: GraphQLResolveInfo
    ) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (
      _parent: any,
      { username, email, password }: { username: string; email: string; password: string },
      _context: any,
      _info: GraphQLResolveInfo
    ) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (
      _parent: any,
      { bookId, authors, description, title, image, link }: any,
      context: { user: { _id: string } | null },
      _info: GraphQLResolveInfo
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: { bookId, authors, description, title, image, link } } },
        { new: true, runValidators: true }
      );
    },
    removeBook: async (
      _parent: any,
      { bookId }: { bookId: string },
      context: { user: { _id: string } | null },
      _info: GraphQLResolveInfo
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

export default resolvers;
