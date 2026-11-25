import { createHash } from 'node:crypto';

// Shared across function instances: restarting or scaling the API does not reset login limits.
export class MongoRateLimitStore {
  constructor(db) { this.collection = db.collection('cms_rate_limits'); }
  init(options) { this.windowMs = options.windowMs; }
  key(value) { return `login:${createHash('sha256').update(value).digest('hex')}`; }
  async increment(key) {
    const now = new Date();
    const expired = { $lte: [{ $ifNull: ['$resetTime', new Date(0)] }, now] };
    const update = [{ $set: {
      hits: { $cond: [expired, 1, { $add: ['$hits', 1] }] },
      resetTime: { $cond: [expired, new Date(now.getTime() + this.windowMs), '$resetTime'] },
    } }];
    const filter = { _id: this.key(key) };
    let row;
    try { row = await this.collection.findOneAndUpdate(filter, update, { upsert: true, returnDocument: 'after' }); }
    catch (error) {
      if (error.code !== 11000) throw error;
      row = await this.collection.findOneAndUpdate(filter, update, { upsert: true, returnDocument: 'after' });
    }
    return { totalHits: row.hits, resetTime: row.resetTime };
  }
  async decrement(key) { await this.collection.updateOne({ _id: this.key(key), hits: { $gt: 0 } }, { $inc: { hits: -1 } }); }
  async resetKey(key) { await this.collection.deleteOne({ _id: this.key(key) }); }
}
