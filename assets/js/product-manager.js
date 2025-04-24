// 商品管理相关脚本
console.log('商品管理脚本已加载'); // 调试信息

let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1001,
        name: "Meta Ray Ban二代智能AI眼镜",
        price: 3188,
        stock: 1,
        status: "上架",
        image: "./assets/images/shopimg/shop1.jpg.avif"
    }
]; // 从本地存储加载商品数据，如果没有则使用默认数据

// 添加商品
window.addProduct = function() {
    console.log('addProduct函数被调用'); // 调试信息
    
    // 获取文件选择器
    const fileInput = document.getElementById('productImage');
    
    // 监听文件选择
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                // 选择图片后继续填写其他信息
                continueAddProduct(imageData);
            };
            reader.readAsDataURL(file);
        } else {
            // 如果没有选择图片，使用默认图片
            continueAddProduct("./assets/images/shopimg/shop1.jpg.avif");
        }
        // 清除文件选择，以便下次选择同一文件时也能触发change事件
        fileInput.value = '';
    };
    
    // 触发文件选择
    fileInput.click();
};

// 继续添加商品的流程
function continueAddProduct(imageData) {
    try {
        const name = prompt('请输入商品名称');
        if (!name) return;
        
        const price = parseFloat(prompt('请输入商品价格'));
        if (isNaN(price) || price < 0) {
            alert('请输入有效的价格');
            return;
        }
        
        const stock = parseInt(prompt('请输入商品库存'));
        if (isNaN(stock) || stock < 0) {
            alert('请输入有效的库存数量');
            return;
        }
        
        const product = {
            id: Date.now(),
            name: name,
            price: price,
            stock: stock,
            status: "上架",
            image: imageData
        };
        
        products.push(product);
        saveProducts();
        updateProductTable();
        alert('商品添加成功！');
    } catch (error) {
        console.error('添加商品时出错:', error); // 调试信息
        alert('添加商品时出错，请重试');
    }
}

// 更新商品表格
window.updateProductTable = function() {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';

    if (products.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="7" class="text-center">暂无商品数据</td>
        `;
        tbody.appendChild(tr);
        return;
    }

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>
                <img src="${product.image}" 
                     alt="商品图片" 
                     style="width: 50px; height: 50px; object-fit: cover;"
                     onerror="this.src='./assets/images/shopimg/shop1.jpg.avif'">
            </td>
            <td>${product.name}</td>
            <td>¥${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <span class="badge ${product.status === '上架' ? 'bg-success' : 'bg-danger'}">
                    ${product.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editProduct(${product.id})">编辑</button>
                <button class="btn btn-sm btn-warning" onclick="toggleProductStatus(${product.id})">
                    ${product.status === '上架' ? '下架' : '上架'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 编辑商品
window.editProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const name = prompt('请输入商品名称', product.name);
    if (!name) return;
    
    const price = parseFloat(prompt('请输入商品价格', product.price));
    if (isNaN(price) || price < 0) {
        alert('请输入有效的价格');
        return;
    }
    
    const stock = parseInt(prompt('请输入商品库存', product.stock));
    if (isNaN(stock) || stock < 0) {
        alert('请输入有效的库存数量');
        return;
    }

    // 询问是否要更改图片
    if (confirm('是否要更改商品图片？')) {
        const fileInput = document.getElementById('productImage');
        fileInput.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    product.image = e.target.result;
                    product.name = name;
                    product.price = price;
                    product.stock = stock;
                    saveProducts();
                    updateProductTable();
                    alert('商品信息更新成功！');
                };
                reader.readAsDataURL(file);
            }
            fileInput.value = '';
        };
        fileInput.click();
    } else {
        product.name = name;
        product.price = price;
        product.stock = stock;
        saveProducts();
        updateProductTable();
        alert('商品信息更新成功！');
    }
}

// 切换商品状态
window.toggleProductStatus = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newStatus = product.status === '上架' ? '下架' : '上架';
    if (confirm(`确定要将商品"${product.name}"${newStatus === '上架' ? '上架' : '下架'}吗？`)) {
        product.status = newStatus;
        saveProducts();
        updateProductTable();
        alert(`商品已${newStatus === '上架' ? '上架' : '下架'}！`);
    }
}

// 删除商品
window.deleteProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (confirm(`确定要删除商品"${product.name}"吗？此操作不可恢复！`)) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        updateProductTable();
        alert('商品删除成功！');
    }
}

// 搜索商品
window.searchProducts = function() {
    const searchText = document.getElementById('searchProduct').value.trim().toLowerCase();
    if (!searchText) {
        updateProductTable();
        return;
    }

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchText) ||
        product.id.toString().includes(searchText) ||
        product.price.toString().includes(searchText) ||
        product.stock.toString().includes(searchText)
    );
    
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';

    if (filteredProducts.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="7" class="text-center">未找到匹配的商品</td>
        `;
        tbody.appendChild(tr);
        return;
    }

    filteredProducts.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>
                <img src="${product.image}" 
                     alt="商品图片" 
                     style="width: 50px; height: 50px; object-fit: cover;"
                     onerror="this.src='./assets/images/shopimg/shop1.jpg.avif'">
            </td>
            <td>${product.name}</td>
            <td>¥${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <span class="badge ${product.status === '上架' ? 'bg-success' : 'bg-danger'}">
                    ${product.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editProduct(${product.id})">编辑</button>
                <button class="btn btn-sm btn-warning" onclick="toggleProductStatus(${product.id})">
                    ${product.status === '上架' ? '下架' : '上架'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 图片预览
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function previewEditImage(input) {
    const preview = document.getElementById('editImagePreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// 保存商品数据到本地存储
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// 初始化时更新商品表格
document.addEventListener('DOMContentLoaded', function() {
    updateProductTable();
    
    // 添加搜索框回车事件
    document.getElementById('searchProduct').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
}); 