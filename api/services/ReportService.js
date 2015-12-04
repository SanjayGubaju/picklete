import xlsx from 'node-xlsx';
import moment from 'moment';
import fs from 'fs';
import _ from 'lodash';

module.exports = {

  create: async (date) => {
    try {

      // [ sheets
      //   { sheet
      //     data:[ SheetData 存放單頁試算表資料
      //       [ ] singleSheetData 存放單頁單行試算表資料
      //     ]
      //     name: 存放單頁試算表頁面名稱
      //   }
      // ]
      let startDate = moment(date, 'YYYY-MM').startOf('month');
      let endDate = moment(date, 'YYYY-MM').endOf('month');
      var totalPrice = 0;

      // sheetHeader 存放單頁試算表表頭
      var sheetHeader = [
        '訂單編號',
        '數量',
        '狀態',
        '購買人',
        '訂單日期',
      ];
      var sheetData = [];
      var sheet = {};
      var sheets = [];
      let allOrder = await OrderService.findAllByDateComplete(startDate, endDate);
      sheetData.push([]);
      sheetData.push(sheetHeader);
      if (allOrder.length != 0) {
        _.forEach(allOrder, function(eachReport) {
          console.log(eachReport);
          let singleSheetData = [];
          let eachReportData = eachReport.dataValues;
          let orderItems = eachReportData.OrderItems;

          singleSheetData.push(eachReportData.serialNumber);
          singleSheetData.push(eachReportData.quantity);
          singleSheetData.push(eachReportData.status);
          singleSheetData.push(eachReportData.User.dataValues.username);
          singleSheetData.push(eachReportData.updatedAt);

          _.forEach(orderItems, function(orderItem) {
            let quantity = orderItem.dataValues.quantity;
            let price = orderItem.dataValues.price;
            totalPrice += quantity * price;
          });

          sheetData.push(singleSheetData);
          sheet.data = sheetData;
          sheet.name = 'Report-' + date;
          console.log(sheet);
        });

        console.log(sheet);
        sheet.data[0].push('總金額', totalPrice);
        sheets.push(sheet);

        let excel = await ReportService.buildExcel(sheets, date, date);
        sails.log(excel);
        return excel;
      } else {
        return null;
      }

    } catch (error) {
      sails.log.error(error);
    }
  },

  buildExcel: async (data, startDate, endDate) => {
    try {
      var excelData = {};
      var filename = '';
      if (startDate === endDate) {
        filename = 'Report-' + startDate;
      } else {
        filename = 'Report-' + startDate + '-' + endDate;
      }

      if (!fs.existsSync('report')) {
        fs.mkdirSync('report');
      }

      let filePath = 'report/' + filename + '.xlsx';
      var buffer = await xlsx.build(data);
      fs.writeFileSync(filePath, buffer);
      return filePath;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  list: async () => {
    try {
      let maxDate = await db.Order.min('paymentConfirmDate');
      maxDate = moment(maxDate);
      let now = moment();
      let startYear = maxDate.get('year');
      let startMonth = maxDate.get('month') + 1;
      let nowYear = now.get('year');
      let nowMonth = now.get('month') + 1;

      // for Debug
      // startYear = 2015;
      // startMonth = 10;
      // nowYear = 2017;
      // nowMonth = 2;
      let dateList = [];

      if (startYear == nowYear) {
        for (; nowMonth >= startMonth; startMonth++) {
          if (startMonth < 10) {
            let month = _.padLeft(startMonth.toString(), 2, '0');
            dateList.push([startYear.toString(), month]);
          } else {
            dateList.push([startYear.toString(), startMonth.toString()]);
          }

        }
      } else if (startYear < nowYear) {

        for (let startMonthCopy = startMonth; startMonthCopy <= 12; startMonthCopy++) {
          if (startMonthCopy < 10) {
            let month = _.padLeft(startMonthCopy.toString(), 2, '0');
            dateList.push([startYear.toString(), month]);
          } else {
            dateList.push([startYear.toString(), startMonthCopy.toString()]);
          }
        }

        startYear++;

        if ((nowYear - startYear) >= 1) {
          let mediumYear = nowYear - startYear - 1;
          let countYear = 0;
          while (countYear <= mediumYear) {
            for (let countMonth = 1; countMonth <= 12; countMonth++) {
              if (countMonth < 10) {
                let month = _.padLeft(countMonth.toString(), 2, '0');
                dateList.push([startYear.toString(), month]);
              } else {
                dateList.push([startYear.toString(), countMonth.toString()]);
              }
            }

            startYear++;
            countYear++;
          }
        }

        for (let countMonth = 1; countMonth <= nowMonth; countMonth++) {
          if (countMonth < 10) {
            let month = _.padLeft(countMonth.toString(), 2, '0');
            dateList.push([startYear.toString(), month]);
          } else {
            dateList.push([startYear.toString(), countMonth.toString()]);
          }
        }
      }

      return dateList;
    } catch (error) {
      console.error(error);
    }
  },
};
