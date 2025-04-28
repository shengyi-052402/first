
// 从本地存储加载商品数据，如果没有则使用空数组
let products = JSON.parse(localStorage.getItem('products')) || [
	{
		id:  1,
		name: 'avatar',
		price: 100000000000,
		stock: 1,
		status: "在售",
		image: '../assets/images/avatar2.jpg'
	},
	{
		id:  2,
		name: '陈逸嘉第一个非洲之心',
		price: 0,
		stock: 1,
		status: "在售",
		image: '../shouye/img/屏幕截图 2025-04-27 212642.png'
	},
];

// 添加商品
window.addProduct = function() {
	console.log(1);
    // 获取文件选择器
    const fileInput = document.getElementById('productImage');
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
        }
        // 清除文件选择，以便下次选择同一文件时也能触发change事件
        fileInput.value = '';
    };
    
    // 触发文件选择
    fileInput.click();
};

// 继续添加商品的流程
function continueAddProduct(imageData) {
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
        id: products.length + 1,
        name: name,
        price: price,
        stock: stock,
        status: "在售",
        image: imageData
    };
    
    products.push(product);
    saveProducts(); // 保存到 localStorage
    updateProductTable();
    alert('商品添加成功！');
}

// 保存商品数据到本地存储
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// 更新商品表格
window.updateProductTable = function() {
    const tbody = $('#productTableBody');
    tbody.empty();
    
    products.forEach(product => {
        const row = `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.name}</td>
                <td>¥${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.status}</td>
                <td>
                    <button class="btn btn-sm" onclick="editProduct(${product.id})">编辑</button>
                    <button class="btn btn-sm" onclick="deleteProduct(${product.id})">删除</button>
                    <button class="btn btn-sm" onclick="toggleProductStatus(${product.id})">${product.status === '在售' ? '下架' : '上架'}</button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// 编辑商品
window.editProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const name = prompt('请输入新的商品名称：', product.name);
    if (!name) return;
    
    const price = parseFloat(prompt('请输入新的商品价格：', product.price));
    if (isNaN(price)) {
        alert('请输入有效的价格！');
        return;
    }
    
    const stock = parseInt(prompt('请输入新的商品库存：', product.stock));
    if (isNaN(stock)) {
        alert('请输入有效的库存数量！');
        return;
    }
    
    product.name = name;
    product.price = price;
    product.stock = stock;
    
    updateProductTable();
    alert('商品信息更新成功！');
}

// 删除商品
window.deleteProduct = function(id) {
    if (confirm('确定要删除这个商品吗？')) {
        products = products.filter(p => p.id !== id);
        saveProducts(); // 更新 localStorage
        updateProductTable();
        alert('商品删除成功！');
    }
}

// 搜索商品
window.searchProducts = function() {
    const keyword = $('#searchProduct').val().toLowerCase();
    if (!keyword) {
        updateProductTable();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(keyword) ||
        product.id.toString().includes(keyword)
    );
    
    const tbody = $('#productTableBody');
    tbody.empty();
    
    filteredProducts.forEach(product => {
        const row = `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.name}</td>
                <td>¥${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.status}</td>
                <td>
                    <button class="btn btn-sm" onclick="editProduct(${product.id})">编辑</button>
                    <button class="btn btn-sm" onclick="deleteProduct(${product.id})">删除</button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// 切换商品状态
window.toggleProductStatus = function(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.status = product.status === '在售' ? '下架' : '在售'; // 切换状态
        saveProducts(); // 更新 localStorage
        updateProductTable(); // 更新表格
        alert(`商品状态已${product.status === '在售' ? '上架' : '下架'}！`);
    }
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

// 初始化
$(document).ready(function() {
    updateProductTable(); // 加载商品数据
    
    // 添加搜索框回车事件
    $('#searchProduct').on('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
}); 