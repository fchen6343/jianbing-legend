# 当前存档格式 / Current save format

v0.13.0 仍是一个本机档案，**没有三槽、导出/导入或当前铁板恢复**。这些是后续 B 阶段内容，不能视为已完成。
v0.13.0 still has one local profile, **not three slots, import/export or in-progress griddle recovery**. Those remain stage B work.

浏览器键 / Browser key: `jianbing-legend:progress`. JSON `version:1`.

```json
{
  "version": 1,
  "wallet": 0,
  "shop": false,
  "owned": [],
  "equipped": [],
  "festival": "spring",
  "events": {"spring": 0, "dragon": 0, "autumn": 0},
  "mode": "classic",
  "days": 1,
  "tutorial": false,
  "rotorOwned": false,
  "rotorOn": false
}
```

| 字段 / Field | 含义 / Meaning |
|---|---|
| wallet | 累积可花游戏币，非真实货币 / Spendable game coins, not real currency |
| shop | 旧版简单开店 / Existing simple shop unlock |
| owned / equipped | 已购买/已装上的装饰 ID，不包括厨具 / Owned/equipped decoration IDs, separate from equipment |
| festival / events | 当前节日与正确订单累计 / Current festival and correct-order counts |
| mode | classic / tianjin，可在空锅无夹子时切换 / Switchable on an empty griddle without an active claw |
| days / tutorial | 游戏日与教程完成标记 / Game day and tutorial completion |
| rotorOwned | v0.13.0 新增，可选；真实购买旋转刮板 / Optional v0.13 field: purchased rotating spreader |
| rotorOn | v0.13.0 新增，可选；拥有设备后的下次营业开关 / Optional v0.13 field: owned device's next-service switch |

旧 profile v1 缺少设备字段时补 false；不会为解锁新功能重设钱包、天数、装饰或活动。设备未拥有时不能仅靠 rotorOn=true 开启。购买扣 550 一次，与开关一起自动保存；试用对象隔离，不写入档案。
Older v1 profiles default missing device fields to false without resetting wallet, days, decor or festivals. A switch alone cannot enable an unowned device. Purchase spends 550 once and autosaves ownership/switch. Trial state is isolated and never saved to the profile.

读取会校验版本、有限数值、合法装饰/主题/模式和布尔值；数值限制在 0–100000000，天数至少为 1，装饰去重，不能装备未拥有装饰。现阶段非法 JSON/版本退回默认值，尚缺明确的损坏提示与可恢复备份，B 阶段必须改善。
Loading validates version, finite numbers, known decor/themes/modes and booleans. Numbers clamp to 0–100000000, days to at least one; decor is deduplicated and unowned items cannot be equipped. Invalid JSON/versions currently fall back to defaults; explicit corruption notices and recovery backups remain stage B work.

其他键 / Other keys: `jianbing-legend:language`, `jianbing-legend:muted`, `jianbing-legend:last-day`. 最近一天成绩不是完整经营档案。数据只存本浏览器，不跨设备同步。
The last-day record is not a full game save. Data stays in this browser without cross-device synchronization.
