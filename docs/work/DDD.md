# 基于 DDD 的前端工程

## 分层架构

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/a/Rq8z1PLnvha4wKAN/a968e077714444e89b9aae997478f46d1257.png)

整体理念基于领域驱动设计（Domain-Driven Design），领域层位于最核心的位置，并且有着一个严格的依赖规则：上层可以依赖下层，但下层不能依赖上层。

目标是在前端工程设计中能做到：

*   视图层尽可能薄：获得的数据能够直接使用到视图层中，禁止在视图层中对数据进行转换、筛选、计算等逻辑操作。
    
*   不同职责的代码进行分层：将不同职责代码合理分层，每层尽可能纯净，互不影响。
    
*   前端字段不受后端影响：返回字段进行纠正，字段含义尽可能直观，在视图层使用时，能够更清晰地描述视图结构。
    
*   可纵观全局领域：前端进行领域模块结构设计时，能够纵览整个项目下所有的领域，以及每个领域下具有的逻辑功能。
    

### 领域层 domain

领域层是整个项目的核心层，它掌管了所有领域下的行为与定义。这部分应该是与具体技术实现无关的纯粹的业务逻辑。

**聚合：**指的是限界上下文中一个个的代码集合体，由实体或值对象构成，其中有一个处于根节点的实体被称为**聚合根**（Aggregate Root）。聚合根控制着所有聚集在其中的其他元素，并且它的名称就是整个聚合的名称。

**实体：**是充血的数据对象，包含了数据和业务规则，且数据和业务规则是内聚的。每个实体都有一个唯一标识（ID），例如订单、用户、账户等。实体在全局领域中是唯一的，不可能在别的领域中存在相同的实体。在前端中，我们把它定义为一个 class 类，在构造函数中初始化实体的属性，在类中定义了实体的方法，属性和方法的返回值主要是用于视图层中的直接展示，同一个实体的逻辑确保只在实体类中编写，在不同视图下可复用。

**值对象：**也是充血的数据对象，也可以包含业务规则，但没有唯一标识，例如Money、Address、Phone等。

**领域服务层：**对不同聚合的封装，聚合是严格面向对象的和内聚的，但聚合之间也要有交互，例如充值成功，需要把充值单置为成功，还要增加账户余额。充值单和账户这两个聚合可以完成各自的逻辑，但是要把这两者放到一个事务内，就需要用到领域服务。在应用中，一个服务应使用单例模式，确保行为的一致性。

### 数据接口层 data-source

数据接口层是整个项目的根基，位于架构分层中的基础设施层，提供了结构清晰、定义规范、前端可直接使用的数据。为了收敛业务逻辑，数据接口层只可以被领域层调用。

**api：**数据请求层，负责 HTTP 请求，是项目中唯一与后端服务进行交互的一层。在这一层中集结了项目内所有的接口函数，避免了数据接口分散到各个页面，统一存放更易管理。

**translator：**数据转换层，这层负责将后端返回的数据“清洗”，改造成更直观的字段(key)、更方便使用的数据(value)。在这一层对接口字段、内容经过二次加工，避免了后端定义字段不规范、混乱对前端的影响，含义清晰、规范的字段在视图层使用时更具有表现力，这里我们解决了上文提出的接口字段不可控性问题。

### 视图层

包括 pages 和 components 中的 tsx 和样式部分。

视图层也就是我们书写交互逻辑、样式的一层，唯一跟前端框架耦合(React、Vue)的一层，这一层只需要调用页面 store，将返回值直接体现在视图层中，无需编写条件判断、数据筛选、数据转换等与视图展示无关的逻辑代码，这些“糙活”都在其他层中已经完成，所以视图层是非常“薄”的一层，只需关注视图的展示与交互，整个 HTML 结构非常直观清晰。

分层作用：将控制层中返回的数据直接使用，视图层中只编写交互与样式。除了视图层与前端框架有关，其他层可独立应用于任何框架的。

### 控制层

包括 pages 和 components 下的 store。 

管理 UI 状态、处理用户交互、对领域对象和领域服务进行编排和组合，一般不包含具体的业务逻辑。控制层被视图层调用。

## 目录结构

```powershell
tbf-loan-fe  
+ bin                           # 可执行命令，如构建脚本
+ config                       # 构建打包配置
+ src                           # 源代码目录
  + domain                  # 领域目录，对应领域层                      
    + models                  # 领域模型 (实体和值对象)
      + loan                    # 借款聚合
        - loan.ts                 # 聚合根
        - coupon.ts               # 优惠券实体
        - amount.ts               # 值对象
      + bill                    # 账单聚合
        - bill.ts           
    + services            # 领域服务
      - loanSubmissionService.ts
      - formValidationService.ts
  + data-source                     # 数据源目录，对应数据接口层
      + user
        - api.ts                  # 用户相关API封装
        - translator.ts           # 数据转换器
      + ...
  + components               # 模块内部可复用组件
  + pages                     # 页面目录
    + homepage             # page1功能目录
      + components          # 页面内组件
        + component1          # 页面内组件1
          - store.ts         # 组件store
          - index.tsx      
      - index.tsx            # 页面入口，对应视图层
      - store.ts             # 页面store，对应控制层
    + page2
    + page3
  + constants                # 常量配置    
  + assets                    # 图片、字体等静态资源
  + styles                      # 全局样式、主题变量
  + utils                       # 工具函数目录，对应基础层
  - app.tsx                     # 模块入口文件 
  
- .npmrc                        # NPM配置
- .editorconfig                # 编辑器配置
- tsconfig.json                # TypeScript配置
- package.json                 # 依赖包声明
- package.lock.json           # 依赖包版本锁定
- README.md  
```

## DDD 的好处

对于前端而言，实施DDD有肉眼可见的好处：

*   稳定的业务知识体系
    
*   可传承的代码体系
    
*   脱离UI的单元测试
    
*   跨端开发、多端共用的便捷性
    
*   明确的团队分工
    
*   需求变更的快速响应
    
*   持续敏捷
    

这些好处对于需要长时间持续迭代的项目团队而言，非常有价值。

## 参考资料

*   [领域驱动设计在前端中的应用](https://mp.weixin.qq.com/s/pROCXZNZ7RKeYDlDUJng_Q)
    
*   [探究 DDD 在前端开发中的应用（二）：什么是 DDD](https://darkyzhou.net/articles/frontend-with-ddd-2)
    
*   [《领域驱动设计精粹》（作者 Vaughn Vernon）](https://book.douban.com/subject/30333944/)

## 重要问题

### 1. 领域模型可以调用领域服务吗？

**简短回答：可以，但这是一种需要谨慎使用的进阶模式。**

**详细解释：**

通常，更常见的模式是**应用服务（Application Service）**来协调领域模型和领域服务。流程如下：

1.  **应用服务**接收请求（例如来自 Controller）。
2.  **应用服务**加载一个或多个**领域模型（通常是聚合根 Aggregate Root）**。
3.  **应用服务**调用**领域服务（Domain Service）**，并将领域模型作为参数传入，执行某个跨模型的复杂业务操作。
4.  **应用服务**调用**领域模型**自身的方法，完成状态变更。
5.  **应用服务**持久化领域模型的变更。

**示例（常规模式）：**
```csharp
// 应用服务
public class TransferApplicationService
{
    private readonly IAccountRepository _accountRepository;
    private readonly BankTransferService _transferService; // 领域服务

    public void Transfer(string fromAccountId, string toAccountId, decimal amount)
    {
        // 1. 加载领域模型
        var fromAccount = _accountRepository.Find(fromAccountId);
        var toAccount = _accountRepository.Find(toAccountId);

        // 2. 调用领域服务，传入模型
        _transferService.Transfer(fromAccount, toAccount, amount);

        // 3. 持久化
        _accountRepository.Save(fromAccount);
        _accountRepository.Save(toAccount);
    }
}
```

**但是，在某些情况下，让领域模型直接调用领域服务会使模型的设计更内聚、更符合业务语义。**

这种情况通常发生在：某个操作本质上是**属于领域模型自身的核心职责**，但完成这个职责需要一些它自身不具备的、需要外部协作才能完成的能力。

为了避免让领域模型依赖具体实现，我们使用**依赖倒置原则（DIP）**。领域模型不直接依赖领域服务，而是依赖一个**领域内的接口**，该接口的实现在运行时被注入。

**如何实现？通过“双重分派”（Double Dispatch）或方法参数注入。**

**示例（进阶模式：模型调用服务）：**

假设一个 `Order`（订单）聚合，需要根据复杂的规则计算折扣。这个折扣规则可能涉及到查询其他商品、用户等级等，这些逻辑不适合放在 `Order` 内部。

1.  **在领域层定义一个服务接口：**
    ```csharp
    // 领域层接口
    public interface IDiscountCalculator
    {
        Discount CalculateDiscountFor(Order order);
    }
    ```

2.  **在基础设施层或领域层实现这个接口（这是一个领域服务）：**
    ```csharp
    // 领域服务实现
    public class DiscountCalculatorService : IDiscountCalculator
    {
        private readonly ICustomerLevelRepository _customerRepo;

        public Discount CalculateDiscountFor(Order order)
        {
            // ... 复杂的逻辑，可能需要查询客户等级、促销活动等
            // ...
            return new Discount(...);
        }
    }
    ```

3.  **在领域模型（Order 聚合）的方法中，接收这个接口作为参数：**
    ```csharp
    public class Order
    {
        public List<OrderItem> Items { get; private set; }
        public Money TotalPrice { get; private set; }
        public Discount AppliedDiscount { get; private set; }

        // 核心业务方法，它调用了外部服务
        public void ApplyDiscount(IDiscountCalculator calculator)
        {
            if (this.Status != OrderStatus.Created)
            {
                throw new InvalidOperationException("Cannot apply discount to a confirmed order.");
            }
            // 订单模型发起了调用，但它只知道接口，不知道具体实现
            var discount = calculator.CalculateDiscountFor(this);
            this.AppliedDiscount = discount;
            this.RecalculateTotalPrice();
        }
        // ... 其他方法
    }
    ```

4.  **在应用服务中进行协调：**
    ```csharp
    public class OrderApplicationService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IDiscountCalculator _discountCalculator; // 注入具体的服务实现

        public void ApplyDiscountToOrder(string orderId)
        {
            var order = _orderRepository.Find(orderId);
            // 将服务实例作为参数传递给模型的方法
            order.ApplyDiscount(_discountCalculator);
            _orderRepository.Save(order);
        }
    }
    ```

**总结：** 让模型调用服务，可以使调用方（应用服务）的代码更简洁（`order.ApplyDiscount(calculator)` 而不是 `var discount = calculator.Calculate(...); order.SetDiscount(discount)`），并且业务意图更清晰地封装在 `Order` 模型内部。但这增加了模型的复杂度，需要谨慎评估。

---

### 2. 两者的定位区别是什么？

下面用一个表格清晰地对比两者的定位区别：

| 特性 | 领域模型 (Domain Model - 特指实体/聚合) | 领域服务 (Domain Service) |
| :--- | :--- | :--- |
| **核心关注点** | **“事物” (Things)**：代表业务中的名词和概念。 | **“过程” (Processes)**：代表业务中的动词和操作。 |
| **状态 (State)** | **有状态的 (Stateful)**：封装了数据和状态，并在其生命周期内维护状态的一致性。 | **无状态的 (Stateless)**：它本身不持有状态。它操作的状态来自于传递给它的领域模型。 |
| **表现形式** | **对象 (Objects)**：如实体（Entity）、值对象（Value Object）、聚合（Aggregate）。 | **服务对象 (Service Objects)**：通常是一个接口和它的实现类，方法名直接体现业务操作。 |
| **生命周期** | 有明确的生命周期（创建、修改、删除），通常需要被持久化。 | 没有生命周期，用完即弃，通常不需要被持久化。 |
| **职责** | 维护自身的不变性（Invariants），执行属于自己的业务规则。 | 协调多个领域模型，或执行不属于任何单个模型的“全局性”业务逻辑。 |

**一个简单的比喻：**

*   **领域模型（如 `Account` 账户）**：像一个**保险箱**。它有自己的属性（余额），并负责保护自己的规则（比如余额不能为负）。你可以命令它“存钱”或“取钱”，它自己会更新余额。
*   **领域服务（如 `BankTransferService` 转账服务）**：像一个**银行柜员**。柜员自己没有钱（无状态）。当需要转账时，你告诉柜员“从A保险箱转100到B保险箱”。柜员会协调这两个保险箱，命令A“取钱”，然后命令B“存钱”，并确保整个过程的原子性。这个“转账”动作不属于A也不属于B，它是一个协调两者的过程。

---

### 3. 什么东西应该放在模型里，什么应该放在领域服务？

这是一个核心的设计决策问题。遵循以下原则可以帮助你判断：

#### **应该放在领域模型（实体/聚合）中：**

1.  **属性和状态**：对象的固有数据，如 `User` 的 `name`、`Order` 的 `totalPrice`。
2.  **只涉及自身状态的业务逻辑**：当一个操作只需要用到该模型自身的数据时，必须放在模型内部。这是实现**富领域模型 (Rich Domain Model)** 的关键。
    *   `Order.AddItem(product, quantity)`：添加商品项并更新总价。
    *   `User.ChangePassword(newPassword)`：修改密码，并可能包含密码复杂度的校验。
    *   `Order.Cancel()`：将订单状态置为“已取消”，并可能记录取消时间。
3.  **维护不变性（Invariants）**：确保对象在任何时候都处于有效状态的规则。
    *   `Order` 的总金额不能为负。
    *   `Product` 的库存不能小于0。
    *   这些检查应该在模型的构造函数和方法中强制执行。

#### **应该放在领域服务中：**

1.  **涉及多个聚合的业务逻辑**：当一个操作需要协调两个或多个不同的聚合时，这个逻辑不属于任何一个聚合，应该放在领域服务中。
    *   **银行转账**：涉及 `FromAccount` 和 `ToAccount` 两个聚合。
    *   **用户分配角色**：涉及 `User` 和 `Role` 两个聚合。
2.  **需要访问外部设施（如 Repository、外部API）的领域逻辑**：当一个业务计算或验证需要查询数据库（超出当前聚合边界）或调用外部系统时。
    *   **检查用户名是否唯一**：在创建 `User` 时，需要查询 `UserRepository`，这个检查过程应该在 `UserRegistrationService` 中。
    *   **货币转换**：需要调用一个外部的汇率服务。
3.  **重要且独立的计算过程**：一个复杂的计算过程，如果把它放在实体中会使实体变得臃肿和职责不清。
    *   上文提到的 `DiscountCalculator` 折扣计算器。
    *   复杂的保险 `PremiumCalculator` 保费计算器。
4.  **将领域对象从一种形式转换为另一种形式的逻辑**：虽然这有时可以用工厂（Factory）模式，但如果转换过程很复杂，也可以用领域服务。

**经验法则（Rule of Thumb）：**

> **首先尝试将业务逻辑放在实体或聚合中。** 如果你发现这个逻辑：
> - 感觉“不自然”，不像是这个“事物”的份内职责。
> - 需要与其他“事物”（聚合）进行交互。
> - 需要它本不应该知道的外部知识（如访问数据库、调用API）。
>
> **那么，就应该将这部分逻辑提取到领域服务中。**

## AI提示词

请分析当前项目中的 store 文件（特别是 `xxx/store.ts`）中的业务逻辑实现，参考项目文档 `DDD 工程.md` 中定义的 DDD（领域驱动设计）规范和架构原则。

请执行以下步骤：

1. **分析现状**：
   - 检查当前 store.ts 文件中包含的业务逻辑类型和复杂度
   - 识别违反 DDD 原则的具体问题（如业务逻辑与状态管理混合、缺乏领域模型等）
   - 对照项目 DDD 规范文档，找出不符合规范的地方

2. **设计重构方案**：
   - 提出符合 DDD 原则的代码组织结构
   - 明确各层职责分离（领域层、应用层、基础设施层等）
   - 设计具体的文件结构和模块划分
   - 说明如何将现有业务逻辑重新分配到合适的层次

3. **制定实施计划**：
   - 列出具体的重构步骤和优先级
   - 标识可能的风险点和注意事项
   - 估算重构工作量和影响范围

请先提供详细的分析报告和重构设计方案，等我确认同意后再开始具体的代码重构实施。