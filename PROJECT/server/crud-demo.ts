/**
 * Task 4 – CRUD Operations Demo
 * MongoDB equivalent of SQL INSERT / SELECT / UPDATE / DELETE on users
 *
 * Run with:  npm run crud-demo
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import { User } from './models/User'

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!, { serverSelectionTimeoutMS: 15000, family: 4 })
  console.log('\n[crud-demo] Connected to MongoDB\n')
  console.log('='.repeat(55))

  // ── CREATE ────────────────────────────────────────────────
  // SQL: INSERT INTO users(username, password) VALUES('admin', '1234');
  console.log('\n📌 CREATE — INSERT INTO users')
  console.log('   SQL: INSERT INTO users(username, password) VALUES(\'admin\', \'1234\');')

  await User.deleteOne({ username: 'demo_user' })   // clean up if re-running
  const newUser = await User.create({ username: 'demo_user', password: '1234' })
  console.log('   ✓ User created:')
  console.log(`     _id      : ${newUser._id}`)
  console.log(`     username : ${newUser.username}`)
  console.log(`     password : ${newUser.password}  ← bcrypt hash of '1234'`)
  console.log(`     createdAt: ${newUser.createdAt}`)

  console.log('\n' + '-'.repeat(55))

  // ── READ ──────────────────────────────────────────────────
  // SQL: SELECT id, username FROM users;
  console.log('\n📌 READ — SELECT * FROM users')
  console.log('   SQL: SELECT id, username FROM users;')

  const allUsers = await User.find().select('-password').lean()
  console.log(`   ✓ Found ${allUsers.length} users:`)
  allUsers.forEach((u, i) => {
    console.log(`     [${i + 1}] _id: ${u._id}  username: ${u.username}`)
  })

  console.log('\n' + '-'.repeat(55))

  // ── UPDATE ────────────────────────────────────────────────
  // SQL: UPDATE users SET password = 'newpass' WHERE username = 'demo_user';
  console.log('\n📌 UPDATE — UPDATE users SET password')
  console.log("   SQL: UPDATE users SET password = 'newpass' WHERE username = 'demo_user';")

  const userToUpdate = await User.findOne({ username: 'demo_user' })!
  userToUpdate!.password = 'newpass'
  await userToUpdate!.save()
  console.log('   ✓ Password updated (re-hashed by bcrypt):')
  console.log(`     username : ${userToUpdate!.username}`)
  console.log(`     password : ${userToUpdate!.password}`)
  console.log(`     updatedAt: ${userToUpdate!.updatedAt}`)

  console.log('\n' + '-'.repeat(55))

  // ── DELETE ────────────────────────────────────────────────
  // SQL: DELETE FROM users WHERE username = 'demo_user';
  console.log('\n📌 DELETE — DELETE FROM users')
  console.log("   SQL: DELETE FROM users WHERE username = 'demo_user';")

  await User.deleteOne({ username: 'demo_user' })
  const check = await User.findOne({ username: 'demo_user' })
  console.log(`   ✓ User deleted. Still exists? ${check ? 'YES' : 'NO'}`)

  console.log('\n' + '='.repeat(55))
  console.log('\n[crud-demo] All 4 CRUD operations complete.\n')

  await mongoose.disconnect()
  process.exit(0)
}

run().catch(err => {
  console.error('[crud-demo] Error:', err.message)
  process.exit(1)
})
