import sqlite3
import random
from datetime import datetime, timedelta

# 创建数据库连接
conn = sqlite3.connect('order.db')
c = conn.cursor()

# 创建带注释的user表
c.execute('''
CREATE TABLE if not exists user_tbl  (
    user_id INTEGER PRIMARY KEY,  -- identity of user
    gender TEXT CHECK(gender IN ('male', 'female')),  -- gender of user
    age INTEGER,  -- age of user
    customer_level INTEGER CHECK(customer_level BETWEEN 1 AND 5)  -- level of customer account
)''')

# 创建带注释的order表（处理保留字）
c.execute('''
CREATE TABLE if not exists "order_tbl" (
    order_id INTEGER PRIMARY KEY,  -- identity of order
    customer_user_id INTEGER REFERENCES user(user_id),  -- identity of customer
    item_name TEXT,  -- item name of this order
    item_number INTEGER,  -- quantity of items
    price REAL,  -- price per item
    date DATE  -- order date
)''')

# 生成10条user数据
'''users = []
for uid in range(1, 11):
    users.append((
        uid,
        random.choice(['male', 'female']),
        random.randint(18, 65),
        random.choice([1,2,3,4,5])
    ))'''

# 生成120条order数据
orders = []
item_pool = ['Laptop', 'Phone', 'Book', 'Shoes', 'Headphones']

c.execute('select max(order_id) from order_tbl')
max_oid = c.fetchone()[0]

for i in range(1, 12):
    start_date = datetime(2024, i, 1)
    for oid in range(1, 11):
        orders.append((
            oid + (i-1) * 10 + max_oid,
            random.randint(1, 10),  # 关联有效user_id
            random.choice(item_pool),
            random.randint(1, 5),
            round(random.uniform(10, 999), 2),
            (start_date + timedelta(days=random.randint(0, 30))).strftime('%Y-%m-%d')
        ))

# 插入数据
#c.executemany('INSERT INTO user_tbl VALUES (?,?,?,?)', users)
c.executemany('INSERT INTO "order_tbl" VALUES (?,?,?,?,?,?)', orders)

# 提交并关闭
conn.commit()
conn.close()