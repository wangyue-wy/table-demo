<template>
  <div class="home">
    <el-tabs v-model="activeName">
      <el-tab-pane label="设置列表" name="1">设置列表</el-tab-pane>
      <el-tab-pane label="查看/编辑" name="2">查看/编辑</el-tab-pane>
    </el-tabs>
    <div class="table-box">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-show="+activeName === 1"
      >
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleLook(scope.row)"
              >查看</el-button
            >
            <el-button size="mini" type="danger" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期"> </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
      </el-table>
      <!-- 编辑查看表格 -->
      <el-form :model="form" ref="ruleForm">
        <el-table
          :data="form.tableLook"
          border
          style="width: 100%"
          v-show="+activeName === 2"
        >
          <el-table-column prop="date" label="分类"> </el-table-column>
          <el-table-column prop="name" label="指标名称"> </el-table-column>
          <el-table-column prop="check" label="是否启用">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.check"
                active-color="#13ce66"
                :disabled="isLook"
                >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="parameters" label="指标参数(m)">
            <template slot-scope="scope">
              <el-form-item :prop="'tableLook.'+scope.$index+'.parameters'" :rules="rules['parameters']">
                <el-input v-model="scope.row.parameters" :disabled="isLook || !scope.row.check"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="baseline" label="参数基线(n)">
            <template slot-scope="scope">
              <el-form-item :prop="'tableLook.'+scope.$index+'.baseline'" :rules="rules['parameters']">
                <el-input v-model="scope.row.baseline" :disabled="isLook || !scope.row.check"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="得分类型*">
            <template slot-scope="scope">
               <el-select v-model="scope.row.type" placeholder="请选择" :disabled="isLook || !scope.row.check">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="得分封顶*">
            <template slot-scope="scope">
              <el-form-item :prop="'tableLook.'+scope.$index+'.score'" :rules="rules['scoreNegative']">
                <el-input v-model="scope.row.score" :disabled="isLook || !scope.row.check"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="参数来源*">
            <template slot-scope="scope">
               <el-select v-model="scope.row.state" placeholder="请选择" :disabled="isLook || !scope.row.check">
                <el-option
                  v-for="item in optionState"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="g" label="参数计算规则*"></el-table-column>
          <el-table-column prop="classification" label="分值计算分类*">
             <template slot-scope="scope">
               <el-select v-model="scope.row.classification" placeholder="请选择" :disabled="isLook || !scope.row.check">
                <el-option
                  v-for="item in optionClassification"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="ladder" label="参数阶梯" width="230px">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.ladder" :key="`lab${index}`" class="ladder-box" :class="isLook || !scope.row.check?'no-click':''">
                <el-form-item>
                  <el-input v-model="scope.row.ladder[index].start" :disabled="index === 0 ||isLook || !scope.row.check" @input="value=>inputLeft(value, index, scope.row.ladder)"></el-input>
                </el-form-item>
                <span>&lt;ms</span>
                <el-form-item>
                  <el-input v-model="scope.row.ladder[index].end" :disabled="index === scope.row.ladder.length - 1 || isLook || !scope.row.check" @input="value=>inputRight(value, index, scope.row.ladder)"></el-input>
                </el-form-item>
                <div v-if="index === 0" class="add" @click="add(scope.row.ladder)">+</div>
                <div v-if="scope.row.ladder.length > 2 && scope.row.ladder.length - 1 === index" class="deleate" @click="deleate(scope.row.ladder)">-</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="j" label="得分/计算公式"></el-table-column>
        </el-table>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      isLook: true, // 用来判断是查看还是编辑
      options: [
        { label: '普通', value: '1' },
        { label: '加分项', value: '2' },
        { label: '扣分项目', value: '3' }
      ],
      optionState: [
        { label: '手动补录', value: '1' },
        { label: '系统', value: '2' }
      ],
      optionClassification: [
        { label: '阶梯类', value: '1' },
        { label: '计算类', value: '2' }
      ],
      activeName: "1",
      form: {
        tableLook: [
          {
            date: '合作伙伴', name: '收入占比', check: false, parameters: 0, baseline: 0, type: '1', score: 12, state: '1', g: '收入占比', classification: '1',  ladder: [{start: '', end: '10%'}, {start: '10%', end: '12%'}, {start: '12%', end: ''}], j: '2'
          },
          {
            date: '合作伙伴', name: '收入占比', check: false, parameters: 0, baseline: 0, type: '2', score: 12, state: '2', g: '收入占比', classification: '2',  ladder: [{start: '', end: '10%'}, {start: '10%', end: ''}], j: '2'
          }
        ],
      },
      rules: {
        parameters: [
          // { required: true, message: '请填写', trigger: ['blur', 'change'] },
          { pattern: /^\d+$/, message: '只能填写数字', trigger: ['blur', 'change']}
        ],
        scorePositive: [
          { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '只能填大于0的正数并且小数部分不超过两位', trigger: ['blur', 'change']}
        ],
        scoreNegative: [
          { pattern: /(^[-][0-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '只能填写负数并且小数部分不超过两位', trigger: ['blur', 'change']}
        ]
      },
      tableData: [
        {
          date: "2022-05",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2023-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2023-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2022-12",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  methods: {
    // 点击查看按钮
    handleLook(row) {
      // 先根据row获取对应的参数，调接口获取到查看的数据，再将radio设为2
      console.log(row)
      this.activeName = '2'
      this.isLook = true
    },
    // 点击编辑按钮
    handleEdit(row) {
      if (this.isThreeMonth(row.date)) {
        this.activeName = '2'
        this.isLook = false
      } else {
        this.$message.error('只能编辑近三个月的配置');
      }
    },
    // 判断是否是近三个月，如果是，才可以编辑
    /**
     * @param time 当前表格的时间
     */
    isThreeMonth (time) {
      // 先获取当前的年月
      const [nowDate, rowDate] = [new Date(), new Date(time)]
      const differMonth = (nowDate.getFullYear() - rowDate.getFullYear()) * 12 + (nowDate.getMonth() - rowDate.getMonth())
      return differMonth > 3 ? false : true
    },
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log('没问题')
        }
      })
    },
    // 添加参数阶梯
    add (list) {
       list.push({start: '', end: ''})
    },
    // 删除参数阶梯
    deleate (list) {
      list.pop()
      list[list.length-1].end = ''
    },
    // 参数阶梯左边input值改变时联动上右
    inputLeft (value, index, list) {
      list[index-1].end = value
    },
    // 参数阶梯右边input值改变时联动下左
    inputRight (value, index, list) {
      list[index+1].start = value
    }
  },
};
</script>

<style lang="less">
.home {
  padding: 40px;
}
.table-box {
  padding-top: 20px;
}
.el-form-item {
  margin-top: 22px;
}
.ladder-box {
  display: flex;
  align-items: center;
  .el-input__inner {
    width: 70px;
  }
  >span {
    padding: 0 10px;
    white-space: nowrap;
  }
  .add {
    font-size: 20px;
    padding-left: 10px;
    cursor: pointer;
  }
  .deleate {
    font-size: 20px;
    padding-left: 10px;
    cursor: pointer;
  }
}
.no-click {
  pointer-events: none;
}
</style>
