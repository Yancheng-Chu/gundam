import {
  fileserver,
  env,
  service
} from 'const.js';
const api = {
  mysql(sql) {
    return createSqlApi(sql)
  },
  getMyneed(unionid) {
    let sql = `
    SELECT a.*, b.offer_id FROM need a LEFT JOIN (SELECT b.id AS offer_id, b.need_id, c.id AS payment_id FROM offer b LEFT JOIN payment c ON b.id = c.offer_id) b ON a.id = b.need_id WHERE unionid='${unionid}' AND (status!=3 OR status is null) AND b.payment_id is null #getMyneed
    `
    //SELECT * FROM need WHERE unionid='${unionid}' ORDER BY id DESC LIMIT 0,1
    return createSqlApi(sql)
  },
  getProvider(unionid) {
    let sql = `
      SELECT * FROM provider WHERE unionid='${unionid}' ORDER BY id DESC LIMIT 0,1 #getProvider
      `
    return createSqlApi(sql)
  },
  getOffers(need_id) {
    let sql = `
      SELECT a.*, b.latitude, b.longitude, b.name as designer, b.rough FROM offer a LEFT JOIN provider b ON a.customer = b.unionid WHERE need_id=${need_id} #getOffers
      `
    return createSqlApi(sql)
  },
  getPlans() {
    let sql = `
    SELECT * FROM service WHERE provider_id = 1 #getPlans
    `
    return createSqlApi(sql)
  },
  getDiys() {
    return createApiMock([
      // '星黛露主题派对布置',
      // '科学实验',
      // '益智玩具',
      // '小丑欢乐活动',// '小丑气球',
      // '神奇魔术表演',// '魔术表演',
      // '恐龙趣味活动',// '人偶互动',
      // '梦想家儿童套餐',
      // '梦想家梦幻套餐',
      // '星黛露主题生日蛋糕',// '可定制蛋糕',
      // '甜品台',
      // '邀请函',
      // '双机位全程跟拍',// '摄影跟拍', '图像精修',
      '摄影跟拍',
      '小丑气球',
      '魔术表演',
      '人偶互动',
      '视频邀请函',
      '可定制蛋糕',
      '图像精修',
      '科学实验'
    ])
  },
  getDiysprice() {
    return createApiMock([
      '报价:699元起',
      '报价:500元起',
      '报价:1000元起',
      '报价:1000元起',
      '报价:9.9元起',
      '报价:800元起',
      '报价:699元起',
      '报价:600元起'
    ])
  },
  publishParty(q) {
    let {
      columns,
      values
    } = transQuary(q)

    let sql = `
    INSERT INTO need (${columns}) VALUES (${values}) #publishParty
    `
    return createSqlApi(sql)
  },
  delParty(need_id) {
    let sql = `
      UPDATE need SET status=3 WHERE id=${need_id} #delParty
      `
    return createSqlApi(sql)
  },
  getOrders(unionid) {
    let sql2 = `
    SELECT a.unionid, a.party_type, a.diy_on as diy_on_need, a.budget, a.person, a.status, a.date as needdate, a.time as needtime, b.* FROM need a LEFT JOIN (SELECT b.*, c.id AS payment_id, c.transaction_id, c.success_time FROM offer b LEFT JOIN payment c ON b.id = c.offer_id) b ON a.id = b.need_id WHERE unionid='${unionid}' AND (payment_id is not null OR status=3) #getOrders
    `
    let sql = `
    SELECT c.*, d.name FROM (SELECT a.*, b.id as offer_id, b.provider, b.title, b.duration, b.price, b.location, b.diy_on as diy_on_offer,b.transaction_id, b.success_time FROM need as a LEFT JOIN (SELECT e.*, f.transaction_id, f.success_time FROM offer e LEFT JOIN payment f ON e.id=f.offer_id) as b ON a.unionid = b.customer AND a.id = b.need_id) c LEFT JOIN provider d ON c.provider = d.unionid WHERE c.unionid='${unionid}' AND (transaction_id is not null OR status=3) #getOrders
    `
    return createSqlApi(sql)
  },
  payOrder(obj) {},
  cancleOrder(obj) {},
  getId() {
    return createApi({}, 'name')
  },
  getNeeds(unionid) {
    let sql = `
    SELECT c.*, d.name FROM (SELECT a.*, b.id as offer_id, b.provider, b.title, b.duration, b.price, b.location, b.diy_on as diy_on_offer,b.transaction_id, b.success_time FROM need as a LEFT JOIN (SELECT e.*, f.transaction_id, f.success_time FROM offer e LEFT JOIN payment f ON e.id=f.offer_id) as b ON a.unionid = b.customer AND a.id = b.need_id) c LEFT JOIN provider d ON c.provider = d.unionid WHERE c.provider = '${unionid}' OR c.provider is null #getNeeds
    `
    return createSqlApi(sql)
  },
  publishProvider(q) {
    let {
      columns,
      values
    } = transQuary(q)

    let sql = `
    INSERT INTO provider (${columns}) VALUES (${values}) #publishProvider
    `
    return createSqlApi(sql)
  },
  deleteProvider(unionid) {
    let sql = `
      DELETE FROM provider WHERE unionid='${unionid}' #deleteProvider
      `
    return createSqlApi(sql)
  },
  publishOffer(q) {
    let {
      columns,
      values
    } = transQuary(q)

    let sql = `
    INSERT INTO offer (${columns}) VALUES (${values}) #publishOffer
    `
    return createSqlApi(sql)
  },
  deleteOffer(offer_id) {
    let sql = `
    DELETE FROM offer WHERE id='${offer_id}' #deleteOffer
    `
    return createSqlApi(sql)
  },
  getOffer(unionid, customer) {
    let sql = `
    SELECT * FROM offer WHERE customer='${customer}' AND provider='${unionid}' #getOffer
    `
    return createSqlApi(sql)
  },
  getPayment(openid, amount, description, out_trade_no, offer_id) {
    return createApi({
      openid,
      amount,
      description, 
      out_trade_no,
      offer_id
    }, 'payment')
  },
  withdraw(need_id){
    let sql =`
    UPDATE need SET status=2 WHERE id=${need_id} #withdraw
    `
    return createSqlApi(sql)
  },
  finish(need_id){
    let sql =`
    UPDATE need SET status=1 WHERE id=${need_id} #finish
    `
    return createSqlApi(sql)
  }
}

function createSqlApi(sql) {
  sql = sql.trim().replace(/\s{2,}/g, ' ')
  console.log('--- sql ---', sql)
  sql = sql.split('#')[0]
  return createApi({
    sql
  })
}

function createApiMock(data) {
  return new Promise(function (resolve) {
    console.log('--- mock data ---', data)
    resolve(data)
  })
}

function createApi(data = {}, api = 'mysql', method = 'POST') {
  return new Promise(function (resolve, reject) {
    let call = {
      config: {
        env
      },
      path: '/api/' + api, // 填入业务自定义路径和参数，根目录，就是 / 
      method: method, // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': service
        // 'X-WX-SERVICE': 'party-server'
        // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称），在上述实践中是 demo
      },
      data: data
    }

    let res = wx.cloud.callContainer(call).then(res => {
      console.log('server success res', res)
      resolve(res)
    }).catch(err => {
      console.log('server error res', res)
      reject(err)
    })
  })
}

function transQuary(q) {
  let columns = ''
  let values = ''
  let v
  for (let column in q) {
    columns += column + ','
    v = q[column]
    values += typeof (v) == 'string' ? "'" + v + "'," : v + ','
  }

  return {
    columns: columns.slice(0, -1),
    values: values.slice(0, -1)
  }
}


export {
  api
}