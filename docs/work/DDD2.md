# 基于 DDD 的前端工程 V2

[【第1680期】领域驱动设计在前端中的应用](https://mp.weixin.qq.com/s/pROCXZNZ7RKeYDlDUJng_Q){link=static}

## 分层架构

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/a/Rq8z1PLnvha4wKAN/62fbf3d5468f4cada417e14ebfc7e98d1257.png)

整体理念基于领域驱动设计（Domain-Driven Design），领域层位于最核心的位置，并且有着一个严格的依赖规则：上层可以依赖下层，但下层不能依赖上层。

目标是在前端工程设计中能做到：

*   视图层尽可能薄：获得的数据能够直接使用到视图层中，禁止在视图层中对数据进行转换、筛选、计算等逻辑操作。
    
*   不同职责的代码进行分层：将不同职责代码合理分层，每层尽可能纯净，互不影响。
    
*   前端字段不受后端影响：返回字段进行纠正，字段含义尽可能直观，在视图层使用时，能够更清晰地描述视图结构。
    
*   可纵观全局领域：前端进行领域模块结构设计时，能够纵览整个项目下所有的领域，以及每个领域下具有的逻辑功能。
    

### 领域层 domain

领域层是整个项目的核心层，它掌管了所有领域下的行为与定义。这部分应该是与具体技术实现无关的纯粹的业务逻辑。

#### 领域模型 models

**聚合：**指的是限界上下文中一个个的代码集合体，由实体或值对象构成，其中有一个处于根节点的实体被称为**聚合根**（Aggregate Root）。聚合根控制着所有聚集在其中的其他元素，并且它的名称就是整个聚合的名称。

**实体：**是充血的数据对象，包含了数据和业务规则，且数据和业务规则是内聚的。每个实体都有一个唯一标识（ID），例如订单、用户、账户等。实体在全局领域中是唯一的，不可能在别的领域中存在相同的实体。在前端中，我们把它定义为一个 class 类，在构造函数中初始化实体的属性，在类中定义了实体的方法，实现与其自身紧密相关的业务操作。例如：合同实体可能有 updateData()、getDisplayText()、getForceReadContracts()等方法。同一个实体的逻辑确保只在实体类中编写，在不同视图下可复用。

**值对象：**也是充血的数据对象，也可以包含业务规则，但没有唯一标识，例如Money、Address、Phone等。

#### 领域状态存储 stores

领域 store 管理相对独立的业务领域或上下文的数据，负责**领域对象（实体）的创建、缓存，并提供对外的操作接口（增删改查等）**。每个领域 Store 通常在应用中作为单例存在，避免同一领域对象出现多个内存实例，保证例如同一个商品在 ProductStore 和 CartStore 中引用的是同一个对象，以确保数据一致性和状态同步。

具体组织上，可以设立一个Root Store（根存储）用于组合和持有所有领域 Stores 实例，方便在应用中通过 Context 或依赖注入提供给组件使用。[MobX 文档](https://cn.mobx.js.org/best/store.html)中强调，领域 Store 的职责包括：实例化领域对象、维护对象唯一性、处理持久化（与后端交互）、接收后端更新并更新现有实例等。通过合理拆分 Store，我们既实现了领域边界的模块化, 也保持了领域模型的干净纯粹。

#### 领域服务 services

领域服务封装不适合放在实体或值对象中的领域逻辑，当某个业务操作或领域逻辑：    

*   **涉及多个不同的实体（或聚合），进行业务编排和协调**，以完成一个完整的用户故事。比如“用户下单”服务可能需要检验购物车商品库存、计算价格（调用商品领域逻辑）、再创建订单对象并调用订单仓储保存，最后清空购物车。这一系列操作可以通过一个 OrderService.checkout(cart) 完成，内部协调各领域对象配合。
    
*   不自然地属于任何一个特定的实体（即，将这个逻辑放在任何一个实体中都会显得不协调或破坏该实体的单一职责）。
    
*   代表一个重要的领域过程或计算，但本身不是一个“事物”（没有身份），比如复杂表单的校验。
    

 领域服务本身通常是无状态的。它们不持有自己的数据状态，而是操作传入的领域对象（实体或值对象）。每次调用的结果仅依赖于输入参数。

通过领域服务，我们可以避免将复杂业务逻辑散落在 UI 组件或多个对象中，提高模块复用性和测试性。值得注意的是，领域服务不是必需的，如果业务逻辑简单清晰，也可以不引入额外的服务层，直接在领域对象或 Store 中实现。但随着应用成长，**服务层有助于保持领域对象的单一职责**（避免膨胀为“上帝对象”），同时实现**复合业务场景的高内聚、低耦合**。

### 数据接口层 api

数据接口层是整个项目的根基，位于架构分层中的基础设施层，提供了结构清晰、定义规范、前端可直接使用的数据。为了收敛业务逻辑，数据接口层只可以被领域层调用。

**api：**数据请求层，负责 HTTP 请求，是项目中唯一与后端服务进行交互的一层。在这一层中集结了项目内所有的接口函数，避免了数据接口分散到各个页面，统一存放更易管理。

**translator：**数据转换层，这层负责将后端返回的数据（DTO）“清洗”，改造成更直观的字段(key)、更方便使用的数据(value)。在这一层对接口字段、内容经过二次加工，避免了后端定义字段不规范、混乱对前端的影响，含义清晰、规范的字段在视图层使用时更具有表现力，这里我们解决了上文提出的接口字段不可控性问题。同理，**将领域数据提交到后台之前，需组装成后台需要的DTO**，也是在translator中完成。

### 视图层

包括 pages 和 components 中的 tsx 和样式部分。

视图层也就是我们书写交互逻辑、样式的一层，唯一跟前端框架耦合(React、Vue)的一层，这一层一般只需要调用页面 store，将返回值直接体现在视图层中，无需编写条件判断、数据筛选、数据转换等与视图展示无关的逻辑代码，这些“糙活”都在其他层中已经完成，所以视图层是非常“薄”的一层，只需关注视图的展示与交互，整个 HTML 结构非常直观清晰。

分层作用：将控制层中返回的数据直接使用，视图层中只编写交互与样式。除了视图层与前端框架有关，其他层可独立应用于任何框架的。

### 控制层

包括 pages 和 components 下的 store。 

管理 UI 状态、处理用户交互、对领域store的操作方法和领域服务进行编排和组合，一般不包含具体的业务逻辑。控制层被视图层调用。

如果页面逻辑和交互很简单，控制层不是必需的，可以由视图层直接调用领域层。

## 目录结构

```powershell
abf-apply-fe  
+ bin                           # 可执行命令，如构建脚本
+ config                       # 构建打包配置
+ src                           # 源代码目录
  + domain                  # 领域目录，对应领域层                      
    + models                  # 领域模型 (实体和值对象)
      + apply                    # 申请聚合
        - apply.ts                 # 聚合根
        - identity-card.ts           # 身份信息页实体
        - personal-info.vo.ts        # 个人信息值对象
      + contract                 # 合同聚合
        - contract.ts 
    + stores                  # 领域store
      - apply-store.ts           # 申请领域store
      - contract-store.ts
      - root-store.ts
    + services                # 领域服务
      - form-validation-service.ts  # 表单校验服务
  + api                     # 数据源目录，对应数据接口层
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

## 正反面案例

1.  领域模型不要实现为贫血模型。「贫血模型」指**领域对象只有数据属性，没有封装业务行为**，逻辑集中在服务或其他层；「充血模型」指**将业务行为方法封装在领域对象内部**，对象既有数据也有行为。
    

```typescript
// ✗ 错误
// 这是一个贫血的 Order 实体，它只知道自己的数据，不知道任何业务行为。
export class Order {
  public id: string;
  public items: OrderItem[] = [];
  public totalPrice: number = 0;
  public isPaid: boolean = false;

  constructor(id: string) {
    this.id = id;
  }

  // 只有一堆公开的 getter 和 setter (或直接 public 属性)，允许外部自由读写
  public setPaid(status: boolean): void {
    this.isPaid = status;
  }

  public setTotalPrice(price: number): void {
    this.totalPrice = price;
  }

  public addItem(item: OrderItem): void {
    this.items.push(item);
  }
}

// ✓ 正确
// 这是一个充血的 Order 实体。数据和行为被封装在一起。
export class Order {
  public readonly id: string; // ID 创建后不可变
  private _items: OrderItem[] = [];
  private _isPaid: boolean = false;

  constructor(id: string) {
    this.id = id;
  }

  // ---- 公开的只读属性，保护内部状态 ----
  public get items(): readonly OrderItem[] {
    return this._items;
  }
  
  public get isPaid(): boolean {
    return this._isPaid;
  }
  
  // 总价是一个计算属性，而不是一个可随意设置的字段，确保它总是正确的
  public get totalPrice(): number {
    return this._items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  // ---- 公开的业务方法，表达业务意图 ----
  
  /**
   * 向订单中添加商品。所有相关的业务规则都在这里强制执行。
   */
  public addItem(productId: string, price: number, quantity: number): void {
    // 业务规则 1: 检查订单是否已支付 (保护不变量)
    if (this._isPaid) {
      throw new Error("Cannot add items to a paid order.");
    }
    
    // 业务规则 2 & 3: 创建并添加商品。总价会自动通过 getter 计算，无需手动更新。
    const newItem = new OrderItem(productId, price, quantity);
    this._items.push(newItem);
    
    console.log(`Item added. New total price for order ${this.id} is ${this.totalPrice}`);
  }

  /**
   * 支付订单
   */
  public pay(): void {
    if (this._items.length === 0) {
      throw new Error("Cannot pay for an empty order.");
    }
    this._isPaid = true;
    console.log(`Order ${this.id} has been paid.`);
  }
}
```

2.  不要把后台接口数据取回后，直接一股脑丢给store用一个大对象进行储存。要按实际的业务逻辑来设计的领域模型的结构，只取所需的字段，并通过 translator 来转换领域数据和后台数据。
    
3.  领域模型不够纯粹，既有单个实体的数据，又有多个实体集合的数据。
    

```typescript
// ✗ 错误
class ContractModel implements ContractInfo {
  /**
   * 强读标识，单个合同的属性
   */
  @observable forceReadFlag = '';

  /**
   * 合同信息列表，合同集合数据
   */
  @observable contractInfoList = null;

  /**
   * 合同展示文案，UI 层所需
   */
  @observable displayText = '';
}

// ✓ 正确
// 合同模型分为单体合同模型 contract 以及合同合集 contractCollection
export class Contract {
  /** 合同唯一标识 */
  id: number;

  /** 强读标识 Y/N */
  forceReadFlag: string;

  /**
   * 业务逻辑：检查是否需要强制阅读
   */
  isForceRead(): boolean {
    return this.forceReadFlag === 'Y';
  }
}

export class ContractCollection {
  /** 合同列表 */
  public contracts: Contract[];

  /**
   * 业务逻辑：获取合同展示文案
   */
  getDisplayText(): string {
    if (this.contracts && this.contracts.length > 0) {
      const contractTextArr: string[] = [];
      this.contracts.forEach((contract: Contract) => {
        // 过滤出贷款告知书
        if (contract.contractType !== 'LOAN_APPLY_NOTICE') {
          contractTextArr.push(contract.getDisplayText());
        }
      });
      return contractTextArr.join('、');
    } else {
      ...
    }
  }

  /**
   * 业务逻辑：获取强读合同列表
   */
  getForceReadContracts(): Contract[] {
    return this.contracts.filter(contract => contract.isForceRead());
  }
}
```

4.  后台接口数据 和 领域对象数据的转换，没有放在 translator 中处理。
    

```typescript
// ✗ 错误
// src/domain/models/apply/personal-info.vo.ts
export class PersonalInfoModel implements PersonalInfo {
    ...
   /**
    * 组装提交参数
    * 收集表单数据并组装成提交格式
    * @returns 提交参数对象
    */
   @action.bound
   assembleSubmitParams(): any {
    const {
      custName,
      certId,
      custTypeSelected,
      careerType,
      incomeRange,
      highestDegree,
      schoolName,
      graduateYear
    } = this;
    
    // 组装提交参数
    const submitParams = {
      applyPersonalInfo: {
        custName,
        certId,
        custTypeSelected
      },
      applyCompanyInfo: {
        careerType,
        incomeRange,
      },
      applyEducationInfo: {
        highestDegree,
        schoolName,
        graduateYear,
      },
    };
    
    console.log('📋 [FormValidationService] 组装提交参数:', submitParams);
    return submitParams;
  }
}


// ✓ 正确
// src/api/apply/translator.ts
export function personalInfoSubmitTranslator(personalInfo: {
  custName?: string;
  certId?: string;
  custTypeSelected?: string;
  careerType?: string;
  incomeRange?: string;
  highestDegree?: string;
  schoolName?: string;
  graduateYear?: string;
}): any {
  const {
    custName = '',
    certId = '',
    custTypeSelected = '',
    careerType = '',
    incomeRange = '',
    highestDegree = '',
    schoolName = '',
    graduateYear = '',
  } = personalInfo || {};

  // 组装提交参数 - 按照后端接口要求的 DTO 结构
  const submitParams = {
    // 个人基础信息
    applyPersonalInfo: {
      custName,
      certId,
      custTypeSelected,
    },
    // 职业收入信息
    applyCompanyInfo: {
      careerType,
      incomeRange,
    },
    // 教育背景信息
    applyEducationInfo: {
      highestDegree,
      schoolName,
      graduateYear,
    },
  };

  return submitParams;
}
```

5.  避免在视图层直接调用 API，在视图层进行数据转换等
    

```typescript
// ✗ 错误
class HomePage extends Component {
  async componentDidMount() {
    // 不应该在视图层直接调用 API
    const data = await fetch('/api/user');
    // 不应该在视图层进行数据转换
    this.setState({ 
      userName: data.nickName || '未知用户' 
    });
  }
}

// ✓ 正确
// model 层
@action.bound
updateUser = (userInfo: Partial<UserInfo>) => {
  this.user.setState(userInfo);
};

// 数据接口层，纯函数转换器
export function userInfoTranslator(data: any): UserInfo {
  return {
    name: data.nickName || '',
    // ...
  };
}
```

### FAQ

## 参考资料

*   [领域驱动设计在前端中的应用](https://mp.weixin.qq.com/s/pROCXZNZ7RKeYDlDUJng_Q)
    
*   [探究 DDD 在前端开发中的应用（二）：什么是 DDD](https://darkyzhou.net/articles/frontend-with-ddd-2)
    
*   [《领域驱动设计精粹》（作者 Vaughn Vernon）](https://alidocs.dingtalk.com/i/nodes/vy20BglGWOaOMNRvil92Mpj7JA7depqY)