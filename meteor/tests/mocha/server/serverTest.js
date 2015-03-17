if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("csv export", function(){
      it("should should flatten the doc from mongo", function(){
        query_return = [ { _id: 'v6g8xfHburkqMXkPe',
            profile:
             { firstName: 'Test2',
               lastName: 'User2',
               street1: '1 Rogers St',
               street2: '',
               city: 'Boston',
               state: 'MA',
               zip: '02141',
               partnerOrg: 'Thrive in Five',
               incomeBracket: '0-9,999',
               numberOfKids: '1',
               race: 'White' } },
          { _id: 'MRycqYopjunL8kemC',
            profile:
             { firstName: 'Test',
               lastName: 'User',
               street1: '10 Emerson',
               street2: '24H',
               city: 'Boston',
               state: 'MA',
               zip: '02114',
               partnerOrg: 'KIPP Academy',
               incomeBracket: '25,000-29,999',
               numberOfKids: '2',
               race: 'African-American or Black' } } ]

        outcome = helperFlattenProfile(query_return)

        expected = [ { firstName: 'Test2',
            lastName: 'User2',
            street1: '1 Rogers St',
            street2: '',
            city: 'Boston',
            state: 'MA',
            zip: '02141',
            partnerOrg: 'Thrive in Five',
            incomeBracket: '0-9,999',
            numberOfKids: '1',
            race: 'White' },
          { firstName: 'Test',
            lastName: 'User',
            street1: '10 Emerson',
            street2: '24H',
            city: 'Boston',
            state: 'MA',
            zip: '02114',
            partnerOrg: 'KIPP Academy',
            incomeBracket: '25,000-29,999',
            numberOfKids: '2',
            race: 'African-American or Black' } ]

        chai.assert.deepEqual(outcome, expected);
      });


    });
  });
}
