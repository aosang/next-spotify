# Stripe 产品同步问题排查指南

## 我做的修复

### 1. 修复了代码问题
- ✅ 修复了 `supabaseAdmin.ts` 中的参数命名（`price` → `product`）
- ✅ 添加了详细的中文日志输出，方便排查问题
- ✅ 改进了错误处理和日志记录

### 2. 代码改进
- 在 webhook 处理时添加了事件类型日志
- 在数据库操作时添加了成功/失败的详细日志
- 改进了错误信息的输出

## 为什么产品没有同步？

产品没有同步到 Supabase 的主要原因通常是 **Webhook 没有正确触发或配置**。

### 关键问题：本地开发环境无法接收 Webhook

如果你在本地开发（`localhost`），Stripe 无法直接发送 webhook 到你的本地环境！

## 解决方案

### 方案 1：使用 Stripe CLI 转发 Webhook（推荐用于本地开发）

1. **安装 Stripe CLI**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   ```

2. **登录 Stripe**
   ```bash
   stripe login
   ```

3. **转发 webhook 到本地**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks
   ```
   
   运行后会显示一个 webhook 密钥，类似：
   ```
   > Ready! Your webhook signing secret is whsec_xxxxx
   ```

4. **设置环境变量**
   将上面的密钥添加到 `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

5. **在新终端触发测试事件**
   ```bash
   # 触发产品创建事件
   stripe trigger product.created
   
   # 触发价格创建事件
   stripe trigger price.created
   ```

### 方案 2：在 Stripe Dashboard 手动触发事件

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com)
2. 进入 **Developers → Events**
3. 找到你创建产品时的事件（`product.created`）
4. 点击事件，然后点击 "Send test webhook"
5. 选择你配置的 webhook endpoint

### 方案 3：部署到生产环境后配置 Webhook

1. 部署应用到 Vercel/其他平台
2. 在 Stripe Dashboard 配置 webhook:
   - 进入 **Developers → Webhooks**
   - 点击 "Add endpoint"
   - URL: `https://your-domain.com/api/webhooks`
   - 选择事件：
     - `product.created`
     - `product.updated`
     - `price.created`
     - `price.updated`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `checkout.session.completed`

## 检查配置清单

### 1. 检查环境变量（`.env.local`）

确保你有这些环境变量：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=你的supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的supabase服务角色密钥

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=你的stripe可发布密钥
STRIPE_SECRET_KEY=你的stripe密钥
STRIPE_WEBHOOK_SECRET=你的webhook密钥
```

### 2. 检查 Supabase 表结构

确保 `products` 表有以下字段：
- `id` (text, primary key)
- `active` (boolean)
- `name` (text)
- `description` (text, nullable)
- `image` (text, nullable)
- `metadata` (jsonb)

### 3. 检查 Stripe 产品状态

在 Stripe Dashboard 中：
- 产品必须是 **Active** 状态
- 产品必须有关联的 **Price**

## 测试步骤

### 1. 启动应用并查看日志

```bash
npm run dev
```

### 2. 在另一个终端启动 Stripe CLI

```bash
stripe listen --forward-to localhost:3000/api/webhooks
```

### 3. 触发测试事件

```bash
stripe trigger product.created
```

### 4. 查看日志输出

你应该看到类似这样的日志：

```
✅ 收到 Stripe webhook 事件: product.created
🔄 处理事件: product.created
📦 处理产品事件: product.created
正在插入/更新产品: Test Product (prod_xxxxx)
✅ 产品插入/更新成功: prod_xxxxx
✅ 事件 product.created 处理成功
```

### 5. 检查 Supabase 数据库

去 Supabase Dashboard 查看 `products` 表，应该能看到新产品。

## 如果还是不行

### 检查错误日志

如果看到错误，常见问题：

1. **❌ Webhook 配置错误: 缺少签名或密钥**
   - 检查 `STRIPE_WEBHOOK_SECRET` 是否设置

2. **❌ Webhook 验证失败**
   - Webhook 密钥可能不正确
   - 使用 Stripe CLI 时，每次运行都会生成新密钥

3. **❌ 产品插入失败**
   - 检查 Supabase 表结构
   - 检查 `SUPABASE_SERVICE_ROLE_KEY` 权限
   - 查看具体的 Supabase 错误信息

4. **⏭️ 忽略不相关的事件**
   - 这是正常的，说明 webhook 在工作，只是事件类型不匹配

## 快速验证 Webhook 是否工作

运行这个命令测试 webhook endpoint：

```bash
curl -X POST http://localhost:3000/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{}'
```

应该返回 400 错误（这是正常的，因为缺少签名），但说明 endpoint 可以访问。

## 需要帮助？

查看终端日志中的具体错误信息，所有重要的步骤都有日志输出。

