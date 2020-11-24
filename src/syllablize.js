/*
Separate module to declare code from Stack Overflow
https://stackoverflow.com/a/51175267/14184670
*/
module.exports = function(word) 
{
    word = word.toLowerCase();                                     
    word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '');   
    word = word.replace(/^y/, '');                                 
    //return word.match(/[aeiouy]{1,2}/g).length;   
    var syl = word.match(/[aeiouy]{1,2}/g);
    console.log(syl);
    if(syl)
    {
        //console.log(syl);
        return syl.length;
    }
}
