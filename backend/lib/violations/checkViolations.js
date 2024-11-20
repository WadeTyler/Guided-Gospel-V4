
// Utility class for checking violations on the user's account
const db = require("../../db/db");

// Users are suspended based on flagscore. Flagscore is a value of violations in weight.
const evaluateFlagscore = async (userid) => {
  try {
    const [user] = await db.query("SELECT * FROM user WHERE userid = ?", [userid]);
    let flagscore = 0;

    // Select all flags in the past week. ONLY WANT TO EVALUATE PAST WEEK.
    const [flags] = await db.query("SELECT weight FROM flags WHERE userid = ? AND timestamp > UTC_TIMESTAMP() - INTERVAL 1 WEEK", [userid]);

    if (flags.length > 0) {
      // Calculate the flagscore of all flags in the past weight
      flags.forEach((flag) => {
        flagscore += flag.weight;
      });

      // Update flagscore
      await db.query("UPDATE user SET flagscore = ? WHERE userid = ?", [flagscore, userid]);
    } else if (user[0].flagscore !== 0) {
      // Set flagscore to 0 if not already 0 and the user has no flags
      await db.query("UPDATE user SET flagscore = 0 WHERE userid = ?", [userid]);
    }

    if (flagscore > 100) {
      // Suspend user
      await db.query("UPDATE user SET suspended = 1 WHERE userid = ?", [userid]);
    } else {
      // Unsuspend user if suspended
      if (user[0].suspended === 1) {
        await db.query("UPDATE user SET suspended = 0 WHERE userid = ?", [userid]);
      }
    }

    console.log(`${user[0].username} has a flagscore of ${flagscore}`);

  } catch (error) {
    console.log("Error in evaluateFlagscore: ", error);
  }
}

// Check for amount of spam violations the user has obtained
const checkPrivateMessageSpamViolations = async (userid) => {
  try {
    const [violations] = await db.query("SELECT violationid FROM violations WHERE violatorid = ? AND violation_type = 'attempted_pm_spam' ORDER BY timestamp DESC LIMIT 1", [userid]);

    let totalWeight = 0;
    // User has violations
    if (violations.length > 0) {

      // Check amount of violations in last 3 minutes
      const [latestViolations] = await db.query("SELECT * FROM violations WHERE violatorid = ? AND violation_type = 'attempted_pm_spam' AND timestamp > UTC_TIMESTAMP() - INTERVAL 3 MINUTE ORDER BY timestamp DESC", [userid]);
      

      if (latestViolations.length > 100) {
        totalWeight += 5;
      }
      else if (latestViolations.length > 75) {
        totalWeight += 1;
      }
      else if (latestViolations.length > 50) {
        totalWeight += .75;
      }
      else if (latestViolations.length > 30) {
        totalWeight += .5;
      }

    }

    // Add new flag or update todays flag
    if (totalWeight > 0) {
      
      const [todaysFlags] = await db.query("SELECT * FROM flags WHERE userid = ? AND timestamp > UTC_TIMESTAMP() - INTERVAL 1 DAY ORDER BY TIMESTAMP DESC", [userid]);
      if (todaysFlags.length > 0) {
        // Update todays flag
        await db.query("UPDATE flags SET weight = weight + ?, timestamp = UTC_TIMESTAMP() WHERE flagid = ?", [totalWeight, todaysFlags[0].flagid]);
      } else {
        // Insert new flag
        await db.query("INSERT INTO flags (userid, weight, timestamp) VALUES(?, ?, UTC_TIMESTAMP())", [userid, totalWeight]);
      }

    }

    evaluateFlagscore(userid);

  } catch (error) {
    console.log("Error checking private message violations: ", error);
  }
}

// Check for amount of flagged_word violations the has obtained
const checkFlaggedWordsViolations = async (userid) => {
   try {
    // Select flagged_word violations today
    const [violations] = await db.query("SELECT * FROM violations WHERE violatorid = ? AND violation_type = ? AND timestamp > UTC_TIMESTAMP() - INTERVAL 1 DAY ORDER BY TIMESTAMP DESC", [userid, 'flagged_word']);
    const violationsCount = violations.length;
    let totalWeight = 0;
    console.log(violationsCount);
    if (violationsCount > 0) {
      // Apply weight based on violation count
      if (violationsCount > 100) {
        totalWeight += 4;
      }
      else if (violationsCount > 85) {
        totalWeight += 3;
      }
      else if (violationsCount > 70) {
        totalWeight += 1.6;
      }
      else if (violationsCount > 55) {
        totalWeight += 1.3;
      }
      else if (violationsCount > 40) {
        totalWeight += 1;
      }
      else if (violationsCount > 25) {
        totalWeight += .5;
      }
      else if (violationsCount > 10) {
        totalWeight += .1;
      }
      else {
        totalWeight += .005;
      }
    }

    // Update todays flag or create a new one
    if (totalWeight > 0) {
      const [todaysFlags] = await db.query("SELECT * FROM flags WHERE userid = ? AND timestamp > UTC_TIMESTAMP() - INTERVAL 1 DAY ORDER BY TIMESTAMP DESC", [userid]);
      if (todaysFlags.length > 0) {
        // Update todays flag
        await db.query("UPDATE flags SET weight = weight + ?, timestamp = UTC_TIMESTAMP() WHERE flagid = ?", [totalWeight, todaysFlags[0].flagid]);
      } else {
        // Insert new flag
        await db.query("INSERT INTO flags (userid, weight, timestamp) VALUES(?, ?, UTC_TIMESTAMP())", [userid, totalWeight]);
      }
    }
    
    // Evaluate total flagscore
    evaluateFlagscore(userid);

   } catch (error) {
    console.log("Error in checkFlaggedWordsViolations: ", error);
   }
}

// userid should be the violatorid
const checkReportedPostsViolations = async (userid) => {
  try {
    // Select reportedPost violations today
    const [violations] = await db.query('SELECT * FROM violations WHERE violatorid = ? AND violation_type = ? AND timestamp > UTC_TIMESTAMP() - INTERVAL 1 DAY ORDER BY timestamp DESC', [userid, 'report_post']);

    const violationsCount = violations.length;
    let totalWeight = 0;

    // Apply weight based on amount of reports
    if (violationsCount > 0) {
      if (violationsCount > 100) totalWeight += 4;
      else if (violationsCount > 75) totalWeight += 5;
      else if (violationsCount > 50) totalWeight += 4;
      else if (violationsCount > 25) totalWeight += 3;
      else if (violationsCount > 10) totalWeight += 2;
      else totalWeight += 1;
    }

    // Check if the post has flagged words

    const [post] = await db.query("SELECT * FROM together_posts WHERE postid = ?", [violations.postid]);
    if (post.length > 0) {
      // Contains flagged words, useless since we check beforehand, but still add for safety net
      if (containsFlagWords(post[0].content)) {
        totalWeight += 2;
      }
    } else {
      // Post not found, sketchy...
      totalWeight += 1;
    }

    // Update todays flag or create a new one
    if (totalWeight > 0) {
      const [todaysFlags] = await db.query("SELECT * FROM flags WHERE userid = ? AND timestamp > UTC_TIMESTAMP() - INTERVAL 1 DAY ORDER BY TIMESTAMP DESC", [userid]);
      if (todaysFlags.length > 0) {
        // Update todays flag
        await db.query("UPDATE flags SET weight = weight + ?, timestamp = UTC_TIMESTAMP() WHERE flagid = ?", [totalWeight, todaysFlags[0].flagid]);
      } else {
        // Insert new flag
        await db.query("INSERT INTO flags (userid, weight, timestamp) VALUES(?, ?, UTC_TIMESTAMP())", [userid, totalWeight]);
      }
    }

    evaluateFlagscore(userid);
    
  } catch (error) {
    console.log("Error in checkReportedPosts: ", error);
  }
}

// List of flagWords
const flagWords = [
  // URLs and Domain Keywords
  'http', 'https', '://', '.com', '.net', '.org', '.io', '.xyz', '.info', '.biz',
  '.ru', '.cn', '.uk', '.au', '.de', '.jp', '.in', '.us', '.fr', '.it', '.ca', 
  '.gov', '.edu', 'download', 'apk', 'exe', 'zip', 'torrent',
  
  // Financial and Scams
  'free', 'money', 'cash', 'earn', 'rich', 'profit', 'reward', 'bonus', 
  'win', 'prize', 'jackpot', 'giveaway', 'lottery', 'investment', 'loan', 
  'bitcoin', 'crypto', 'nft', 'forex', 'stock', 'trading', 'fund',

  // Suspicious Actions and Accounts
  'account', 'verify', 'login', 'support', 'update', 'urgent', 'security', 
  'breach', 'alert', 'warning', 'phish', 'spam', 'malware', 'virus', 'fake', 
  'fraud', 'scam', 'trap', 'trick', 'hack', 'leak', 'password',

  // Adult Content
  'porn', 'xxx', 'sex', 'dating', 'escort', 'viagra', 'cialis', 
  'nude', 'explicit', 'webcam', 'camgirl', 'sugar daddy', 'onlyfans',

  // Gambling and Betting
  'casino', 'bet', 'gamble', 'poker', 'slots', 'blackjack', 'roulette', 
  'sportsbook', 'wager', 'bingo',

  // Promotions and Marketing
  'cheap', 'discount', 'offer', 'deal', 'promo', 'sale', 'coupon', 
  'advertisement', 'ad', 'ads', 'marketing', 'seo', 'viral', 
  'subscribers', 'referral', 'promotion',

  // Payment and Gift Scams
  'gift', 'card', 'amazon', 'paypal', 'ebay', 'apple',
  'voucher', 'redeem', 'code', 'cashback', 'prepaid',

  // Miscellaneous
  'download now', 'click here', 'act now', 'limited time', 'exclusive', 
  'urgent', 'guaranteed', 'no risk', 'fast cash', 'double your money'
];

// Escape regex pattern
const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const regexPattern = flagWords.map(escapeRegex).join('|');
const flagWordsRegex = new RegExp(regexPattern, 'i');

const containsFlagWords = (input) => {
  return flagWordsRegex.test(input);
}

module.exports = {
  containsFlagWords,
  checkPrivateMessageSpamViolations,
  checkFlaggedWordsViolations,
  evaluateFlagscore,
  checkReportedPostsViolations
}