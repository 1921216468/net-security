<template>
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>关于我们</h3>
                <p>项目简介和团队信息。</p>
            </div>
            <div class="footer-section">
                <h3>快速链接</h3>
                <ul>
                    <li><a href="#">首页</a></li>
                    <li><a href="#">产品</a></li>
                    <li><a href="#">联系我们</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>联系方式</h3>
                <p>Email: info@example.com</p>
                <p>地址: 123 Street, City, Country</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Your Company. All Rights Reserved.</p>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 30px 0;
}

.footer-content {
    display: flex;
    justify-content: space-around;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-section {
    width: 30%;
}

.footer-section h3 {
    font-size: 1.2em;
    margin-bottom: 10px;
}

ul {
    list-style: none;
    padding: 0;
}

ul li {
    margin-bottom: 8px;
}

a {
    color: #ecf0f1;
    text-decoration: none;
}

.footer-bottom {
    text-align: center;
    padding-top: 20px;
    background-color: #34495e;
}
</style>
