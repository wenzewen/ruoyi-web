<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
             label-width="68px">
      <el-form-item label="类型名称" prop="categoryName">
        <el-input
          v-model="queryParams.categoryName"
          placeholder="请输入类型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="父类型id" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入父类型id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型编码" prop="categoryCode">
        <el-input
          v-model="queryParams.categoryCode"
          placeholder="请输入类型编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="级别：分三层级：1、2、3" prop="level">
        <el-input
          v-model="queryParams.level"
          placeholder="请输入级别：分三层级：1、2、3"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序：数值越大越排前面" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入排序：数值越大越排前面"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态：0 ：禁用，1：启用" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态：0 ：禁用，1：启用" clearable
                   size="small">
          <el-option label="请选择字典生成" value=""/>
        </el-select>
      </el-form-item>
      <el-form-item label="最后修改时间" prop="lastUpdateTime">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.lastUpdateTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择最后修改时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="图标" prop="iconUrl">
        <el-input
          v-model="queryParams.iconUrl"
          placeholder="请输入图标"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['goods:category:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['goods:category:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['goods:category:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['goods:category:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="categoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键ID(采用分布式ObjectId生成策略 24位长度)" align="center" prop="id"/>
      <el-table-column label="类型名称" align="center" prop="categoryName"/>
      <el-table-column label="父类型id" align="center" prop="parentId"/>
      <el-table-column label="类型编码" align="center" prop="categoryCode"/>
      <el-table-column label="级别：分三层级：1、2、3" align="center" prop="level"/>
      <el-table-column label="排序：数值越大越排前面" align="center" prop="orderNum"/>
      <el-table-column label="描述" align="center" prop="description"/>
      <el-table-column label="状态：0 ：禁用，1：启用" align="center" prop="status"/>
      <el-table-column label="最后修改时间" align="center" prop="lastUpdateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastUpdateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center" prop="iconUrl"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['goods:category:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['goods:category:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改商品后端类型信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入类型名称"/>
        </el-form-item>
        <el-form-item label="父类型id" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父类型id"/>
        </el-form-item>
        <el-form-item label="类型编码" prop="categoryCode">
          <el-input v-model="form.categoryCode" placeholder="请输入类型编码"/>
        </el-form-item>
        <el-form-item label="级别：分三层级：1、2、3" prop="level">
          <el-input v-model="form.level" placeholder="请输入级别：分三层级：1、2、3"/>
        </el-form-item>
        <el-form-item label="排序：数值越大越排前面" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入排序：数值越大越排前面"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述"/>
        </el-form-item>
        <el-form-item label="状态：0 ：禁用，1：启用">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最后修改时间" prop="lastUpdateTime">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.lastUpdateTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择最后修改时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图标" prop="iconUrl">
          <el-input v-model="form.iconUrl" placeholder="请输入图标"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listCategory,
    getCategory,
    delCategory,
    addCategory,
    updateCategory
  } from "@/api/goods/category";

  export default {
    name: "Category",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 商品后端类型信息表格数据
        categoryList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          categoryName: null,
          parentId: null,
          categoryCode: null,
          level: null,
          orderNum: null,
          description: null,
          status: null,
          lastUpdateTime: null,
          iconUrl: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          categoryName: [
            {required: true, message: "类型名称不能为空", trigger: "blur"}
          ],
          parentId: [
            {required: true, message: "父类型id不能为空", trigger: "blur"}
          ],
          level: [
            {required: true, message: "级别：分三层级：1、2、3不能为空", trigger: "blur"}
          ],
          createTime: [
            {required: true, message: "创建时间不能为空", trigger: "blur"}
          ],
          lastUpdateTime: [
            {required: true, message: "最后修改时间不能为空", trigger: "blur"}
          ],
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询商品后端类型信息列表 */
      getList() {
        this.loading = true;
        listCategory(this.queryParams).then(response => {
          this.categoryList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          categoryName: null,
          parentId: null,
          categoryCode: null,
          level: null,
          orderNum: null,
          description: null,
          status: 0,
          createTime: null,
          lastUpdateTime: null,
          iconUrl: null,
          createBy: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加商品后端类型信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getCategory(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改商品后端类型信息";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateCategory(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addCategory(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除商品后端类型信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delCategory(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('goods/category/export', {
          ...this.queryParams
        }, `goods_category.xlsx`)
      }
    }
  };
</script>
