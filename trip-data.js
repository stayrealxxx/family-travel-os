window.TRIP_DATA = {
  title: "West Coast Christmas 2026",
  lastUpdated: "2026-09-17",
  travelers: "2 adults + 2 children",
  home: "Downingtown, PA",
  dateStart: "2026-12-23T08:00:00-05:00",
  dateEnd: "2027-01-02T21:00:00-05:00",
  hardDeadline: "2027-01-03",
  defaultRoute: "B",

  statuses: [
    { icon: "✈️", label: "Flights", status: "CONSIDERING", detail: "优先比较 Route A / B" },
    { icon: "🏨", label: "Hotels", status: "CONSIDERING", detail: "Thousand Oaks / Westlake Village" },
    { icon: "🚗", label: "Rental Car", status: "STILL NEEDED", detail: "车型、儿童座椅和异地还车待定" },
    { icon: "🎟️", label: "Activities", status: "STILL NEEDED", detail: "朋友聚会 + 机动亲子活动" }
  ],

  routes: {
    A: {
      name: "Route A · LA → San Jose",
      note: "先在 Thousand Oaks / Newbury Park 一带住约 7 晚，再去 San Jose。此路线仍在比较中，并未选定。",
      mapQuery: "Philadelphia International Airport to Thousand Oaks CA to San Jose CA to San Francisco International Airport",
      nodes: [
        { code: "PHL", city: "Philadelphia" },
        { code: "LAX", city: "Los Angeles" },
        { code: "TO", city: "Thousand Oaks" },
        { code: "SJC", city: "San Jose" },
        { code: "SFO", city: "San Francisco" },
        { code: "PHL", city: "Home" }
      ],
      next: {
        title: "PHL → LAX",
        date: "2026-12-23",
        detail: "跨大陆航段 · 优先 nonstop · 具体航班待实时确认"
      },
      timeline: [
        { date: "12/23", title: "PHL → LAX", desc: "抵达南加州后前往 Thousand Oaks / Newbury Park。", tags: ["Flight", "Transfer"] },
        { date: "12/24–12/29", title: "Thousand Oaks / Los Angeles", desc: "以朋友探访为主，穿插一个灵活亲子活动；尽量保持一个住宿基地。", tags: ["Friends", "Family"] },
        { date: "12/30", title: "LAX → SJC", desc: "加州境内短途飞行；比较 SJC 与 SFO 的整体便利性。", tags: ["Flight", "Hotel move"] },
        { date: "12/31–01/01", title: "San Jose", desc: "约两个完整探访日。", tags: ["Friends"] },
        { date: "01/02", title: "SFO / SJC → PHL", desc: "目标当天回到费城地区，1/3 保留为 buffer。", tags: ["Flight", "Home"] }
      ]
    },

    B: {
      name: "Route B · San Jose → LA",
      note: "你目前非常感兴趣的方案：先解决湾区探访，再到 Thousand Oaks / Los Angeles 连住约一周。仍是 CONSIDERING。",
      mapQuery: "Philadelphia International Airport to San Jose CA to Thousand Oaks CA to Los Angeles International Airport to Philadelphia International Airport",
      nodes: [
        { code: "PHL", city: "Philadelphia" },
        { code: "SFO", city: "Bay Area" },
        { code: "SJC", city: "San Jose" },
        { code: "TO", city: "Thousand Oaks" },
        { code: "LAX", city: "Los Angeles" },
        { code: "PHL", city: "Home" }
      ],
      next: {
        title: "PHL → SFO / SJC",
        date: "2026-12-23",
        detail: "跨大陆航段 · 优先 nonstop · 到达后前往 San Jose"
      },
      timeline: [
        { date: "12/23", title: "PHL → Bay Area", desc: "优先寻找 PHL → SFO nonstop；抵达后前往 San Jose。", tags: ["Flight", "Transfer"] },
        { date: "12/24–12/25", title: "San Jose", desc: "安排约两个完整探访日；住宿方式仍待确认。", tags: ["Friends"] },
        { date: "12/26", title: "SJC → LAX", desc: "短途飞往 Los Angeles，再前往 Thousand Oaks / Newbury Park。", tags: ["Flight", "Hotel move"] },
        { date: "12/27–01/01", title: "Thousand Oaks / Los Angeles", desc: "朋友探访为主；尽量整段住同一家酒店，减少行李搬动。", tags: ["Friends", "Family"] },
        { date: "01/02", title: "LAX → PHL", desc: "目标当天回到费城地区；1/3 完整留作 buffer。", tags: ["Flight", "Home"] }
      ]
    },

    C: {
      name: "Route C · LAX 往返 + San Jose Side Trip",
      note: "可能有票价优势，但会增加一次额外往返、打包和酒店切换。仅作为价格对照。",
      mapQuery: "Philadelphia International Airport to Los Angeles International Airport to San Jose CA to Los Angeles International Airport to Philadelphia International Airport",
      nodes: [
        { code: "PHL", city: "Philadelphia" },
        { code: "LAX", city: "Los Angeles" },
        { code: "SJC", city: "San Jose" },
        { code: "LAX", city: "Los Angeles" },
        { code: "PHL", city: "Home" }
      ],
      next: { title: "PHL → LAX", date: "2026-12-23", detail: "先飞 LA，之后安排 San Jose 往返 side trip。" },
      timeline: [
        { date: "12/23", title: "PHL → LAX", desc: "抵达南加州。", tags: ["Flight"] },
        { date: "12/24–12/27", title: "Thousand Oaks / Los Angeles", desc: "第一段 LA 停留。", tags: ["Friends"] },
        { date: "12/28–12/30", title: "San Jose Side Trip", desc: "往返湾区；会增加机场和行李折腾。", tags: ["Flight", "Hotel move"] },
        { date: "12/31–01/01", title: "回到 Los Angeles", desc: "第二段 LA 停留。", tags: ["Friends"] },
        { date: "01/02", title: "LAX → PHL", desc: "返家。", tags: ["Flight", "Home"] }
      ]
    },

    D: {
      name: "Route D · Bay Area → Drive → LA",
      note: "飞行段最少，但增加一整天长途自驾，需要比较 one-way rental、油费和儿童长途乘车疲劳。",
      mapQuery: "Philadelphia International Airport to San Jose CA to Thousand Oaks CA to Los Angeles International Airport to Philadelphia International Airport",
      nodes: [
        { code: "PHL", city: "Philadelphia" },
        { code: "SFO", city: "Bay Area" },
        { code: "SJC", city: "San Jose" },
        { code: "🚗", city: "Drive" },
        { code: "TO", city: "Thousand Oaks" },
        { code: "LAX", city: "Los Angeles" },
        { code: "PHL", city: "Home" }
      ],
      next: { title: "PHL → Bay Area", date: "2026-12-23", detail: "抵达后先停留 San Jose，再单程自驾去 LA。" },
      timeline: [
        { date: "12/23", title: "PHL → Bay Area", desc: "抵达湾区。", tags: ["Flight"] },
        { date: "12/24–12/25", title: "San Jose", desc: "朋友探访。", tags: ["Friends"] },
        { date: "12/26", title: "San Jose → Thousand Oaks", desc: "单程长途自驾；实际时间受假日交通和停靠影响。", tags: ["Drive", "Transfer"] },
        { date: "12/27–01/01", title: "Thousand Oaks / Los Angeles", desc: "朋友探访和灵活亲子活动。", tags: ["Friends", "Family"] },
        { date: "01/02", title: "LAX → PHL", desc: "返家。", tags: ["Flight", "Home"] }
      ]
    }
  },

  checklist: [
    { id: "friends", title: "确认两地朋友的可见面日期", sub: "重点确认圣诞节期间 San Jose 与 Thousand Oaks 的安排" },
    { id: "flights", title: "完成 Route A / B 实时机票比较", sub: "一家四口总价、nonstop、选座、行李和 door-to-door 时间" },
    { id: "sjclodging", title: "确认 San Jose 是否需要酒店", sub: "住朋友家还是自行订房" },
    { id: "lahotel", title: "短名单 Thousand Oaks 酒店", sub: "Marriott / IHG / Hyatt / The Edit，核算早餐、停车和信用卡权益" },
    { id: "rental", title: "确定租车方案", sub: "车辆尺寸、儿童座椅、是否分两段租、异地还车" },
    { id: "cards", title: "核对本次可用信用卡权益", sub: "Chase、Amex、Marriott、IHG、Bilt" },
    { id: "dining", title: "安排圣诞 / 新年期间用餐", sub: "确认节假日营业时间和是否需要订位" }
  ],

  decisions: [
    ["状态", "所有路线仍为 CONSIDERING；尚未授权预订。"],
    ["返程目标", "2027-01-02 回到费城地区；2027-01-03 保留 buffer。"],
    ["LA 目标", "Thousand Oaks / Newbury Park 附近约一周，尽量只用一个住宿基地。"],
    ["San Jose", "约两个完整探访日；住宿方式仍待确认。"],
    ["优先比较", "Route A 与 Route B；C/D 作为价格或物流替代方案。"]
  ]
};
