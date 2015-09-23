describe.only("ShippingService", () => {

  // before testing starts
  before(async (done) => {
    // pre-built data
    let testDatas = [
    {
      type: 'postoffice',
      region: 'Taiwan island',
      fee: '100'
    },{
      type: 'postoffice',
      region: 'Out of Taiwan island',
      fee: '200'
    },{
      type: 'delivery',
      region: 'Taiwan island',
      fee: '150'
    },{
      type: 'delivery',
      region: 'Out of Taiwan island',
      fee: '300'
    }];

    await* testDatas.map((testData) => {
      db.Shipping.create(testData);
    });

    done();
  });
  // end before

  // after testing
  after((done) => {
    done();
  });
  // end after

  // list all
  it('get all Shippings', async (done) => {
    try {
      // we prebuilt 4 datas before testing.
      let findAll = await ShippingService.findAll();

      // console.log('=== findAll ==>\n',findAll);

      // part 1 - length check
      findAll.length.should.be.equal(4);
      // part 2 - first one's data
      findAll[0].type.should.be.equal("postoffice");
      findAll[0].region.should.be.equal("Taiwan island");
      findAll[0].fee.should.be.equal(100);
      // part 3 - last one's data
      findAll[3].type.should.be.equal("delivery");
      findAll[3].region.should.be.equal("Out of Taiwan island");
      findAll[3].fee.should.be.equal(300);

      done();
    } catch (e) {
      done(e);
    }
  });
  // end list all

  // save all
  it('save SelectionActive', async (done) => {
    // delete all datas before save them all.
    try {
      // this should get a length which should = 4
      let findAllFirst = await ShippingService.findAll();

      // save 5 datas
      let testDatas = [
      {
        type: 'postoffice',
        region: 'Taiwan island',
        fee: '100'
      },{
        type: 'postoffice',
        region: 'Out of Taiwan island',
        fee: '200'
      },{
        type: 'delivery',
        region: 'Taiwan island',
        fee: '150'
      },{
        type: 'delivery',
        region: 'Out of Taiwan island',
        fee: '300'
      },{
        type: 'delivery',
        region: 'within 24H Taiwan',
        fee: '500'
      }];
      await ShippingService.saveAll(testDatas);

      // this should get a length which should = 5
      let findAllAgain = await ShippingService.findAll();

      console.log('=== findAllAgain ==>\n',findAllAgain);

      // part 1 - length check
      findAllFirst.length.should.be.equal(4);
      findAllAgain.length.should.be.equal(5);
      // part 2 - first one's data
      findAllAgain[0].type.should.be.equal("postoffice");
      findAllAgain[0].region.should.be.equal("Taiwan island");
      findAllAgain[0].fee.should.be.equal(100);
      // part 3 - last one's data
      findAllAgain[4].type.should.be.equal("delivery");
      findAllAgain[4].region.should.be.equal("within 24H Taiwan");
      findAllAgain[4].fee.should.be.equal(300);

      done();
    } catch (e) {
      done(e);
    }
  });
});
