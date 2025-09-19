const db = require('./../db')

test('db test with function', done => {
    db.run('SELECT * FROM test WHERE test_id = ?', [1], (err, row) => {
        if (err) {
            done(err)
            return
        }
        try {
            expect(row[0].test_value).toBe('test passed')
            done()
        } catch (err) {
            done(err)
        }
    })
})
test('db test without function', () => {
    expect(db.run('SELECT * FROM test WHERE test_id = ?', [1])).toBe(undefined)
})