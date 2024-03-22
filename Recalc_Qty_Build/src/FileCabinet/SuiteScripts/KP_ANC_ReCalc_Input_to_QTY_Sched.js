/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search','N/record','N/query', 'N/format', 'N/email'],

function(search,record,query, format, email) {
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
    function execute(scriptContext) {
        log.debug('Scheduled Script TEST', 'Scheduled Script Executed');
        var customlist305SearchColName = search.createColumn({ name: 'name', sort: search.Sort.ASC });
        var customlist305SearchColInternalId = search.createColumn({ name: 'internalid' });

        var customlist305Search = search.create({
            type: 'customlist305',
            filters: [
                ['internalid', 'noneof', '@NONE@', '11']
            ],
            columns: [
                customlist305SearchColName,
                customlist305SearchColInternalId,
            ],
        });

        var customlist305SearchPagedData = customlist305Search.runPaged({ pageSize: 1000 });
        for (var i = 0; i < customlist305SearchPagedData.pageRanges.length; i++) {
            var customlist305SearchPage = customlist305SearchPagedData.fetch({ index: i });
            customlist305SearchPage.data.forEach(function (result) {
                var name = result.getValue(customlist305SearchColName);
                var prodTypeId = result.getValue(customlist305SearchColInternalId);

                log.debug('prodTypeId',prodTypeId)
                //prodTypeList.push(internalId);
                // ...
                var transactionSearchColTranDate = search.createColumn({ name: 'trandate', summary: search.Summary.GROUP });
                
                var transactionSearch = search.create({
                    type: 'transaction',
                    filters: [
                        ['type', 'anyof', 'Build'],
                        'AND',
                        ['mainline', 'is', 'T'],
                        'AND',
                        ['custbody25', 'noneof', '@NONE@', '11'],
                        'AND',
                        ['custbody25', 'anyof', prodTypeId],
                        'AND',
                        ['custbody_custom_for_recalc', 'is', 'T']
                    ],
                    columns: [
                        transactionSearchColTranDate,
                    ],
                });
                
                // // Note: Search.run() is limited to 4,000 results
                // transactionSearch.run().each((result: search.Result): boolean => {
                //     // ...
                //
                //     return true;
                // });
                
                var transactionSearchPagedData = transactionSearch.runPaged({ pageSize: 1000 });
                log.debug('ransactionSearchPagedData.pageRanges.length',transactionSearchPagedData.pageRanges.length)
                for (var j = 0; j < transactionSearchPagedData.pageRanges.length; j++) {
                    var transactionSearchPage = transactionSearchPagedData.fetch({ index: j });
                    transactionSearchPage.data.forEach(function (result) {
                        var tranDate = result.getValue(transactionSearchColTranDate);
                
                        // ...

                        log.debug('tranDate',tranDate)

                        /*var tranDateOnly = format.format({
                            value: tranDate,
                            type: format.Type.DATE
                        });*/

                        var transactionSearchColInternalId = search.createColumn({ name: 'internalid' });
                        var transactionSearchColProductionType = search.createColumn({ name: 'custbody25' });
                        var transactionSearchColDate = search.createColumn({ name: 'trandate' });
                        var transactionSearchColAssemblyBuildNo = search.createColumn({ name: 'tranid' });
                        var transactionSearchColOutputItem = search.createColumn({ name: 'item' });
                        var transactionSearchColType = search.createColumn({ name: 'type', join: 'item' });
                        var transactionSearchColUnits = search.createColumn({ name: 'unit' });
                        var transactionSearchColUnitCost = search.createColumn({ name: 'rate' });
                        var transactionSearchColQtyProduced = search.createColumn({ name: 'quantity' });
                        var transactionSearchColProductionAmount = search.createColumn({ name: 'amount' });
                        var transactionSearchColSellingPrice = search.createColumn({  name: 'custbody_custom_selling_price' });
                        var transactionSearchColRbdAvePurchasePrice = search.createColumn({  name: 'custbody_custom_rbd_ave_purchase_price' });
                        var transactionSearchColFactor = search.createColumn({ name: 'custbody_custom_factor', function: 'roundToHundredths' });
                        var transactionSearchColQtyfactorformula = search.createColumn({ name: 'formulanumeric',  function: 'roundToHundredths', formula: '{quantity}*{custbody_custom_factor}' });
                        var transactionSearchColQtyfactorcustomField = search.createColumn({ name: 'custbody27' });
                        var transactionSearchColWeightedAve = search.createColumn({ name: 'formulanumeric', formula: '{quantity}*{custbody_custom_factorr}' });
                        var transactionSearchColWeightedAvgcustomField = search.createColumn({ name: 'custbody28' });
                        var transactionSearchColTotalAmounttodayCustom = search.createColumn({ name: 'custbody29' });
                        var transactionSearchColNewCalculatedCost = search.createColumn({ name: 'custbody26' });
                        var transactionSearchColAverageUnitCost = search.createColumn({ name: 'custbody_custom_average_unit_cost' });
                        var transactionSearchColRecalcInputQty = search.createColumn({ name: 'formulanumeric', formula: '{custbody26}/{rate}' });
                        var transactionSearch = search.create({
                        type: 'transaction',
                        filters: [
                            ['type', 'anyof', 'Build'],
                            'AND',
                            ['mainline', 'is', 'T'],
                            'AND',
                            ['trandate', 'on', tranDate, tranDate],
                            'AND',
                            ['custbody25', 'noneof', '@NONE@', '11'],
                            'AND',
                            ['custbody_custom_for_recalc', 'is', 'T']
                            //'AND',
                            //['custbody25', 'anyof', prodTypeId],
                            //'AND',
                            //['internalid', 'anyof', '94554'],
                        ],
                        columns: [
                            transactionSearchColInternalId,
                            transactionSearchColProductionType,
                            transactionSearchColDate,
                            transactionSearchColAssemblyBuildNo,
                            transactionSearchColOutputItem,
                            transactionSearchColType,
                            transactionSearchColUnits,
                            transactionSearchColUnitCost,
                            transactionSearchColQtyProduced,
                            transactionSearchColProductionAmount,
                            transactionSearchColSellingPrice,
                            transactionSearchColRbdAvePurchasePrice,
                            transactionSearchColFactor,
                            transactionSearchColQtyfactorformula,
                            transactionSearchColQtyfactorcustomField,
                            transactionSearchColWeightedAve,
                            transactionSearchColWeightedAvgcustomField,
                            transactionSearchColTotalAmounttodayCustom,
                            transactionSearchColNewCalculatedCost,
                            transactionSearchColAverageUnitCost,
                            transactionSearchColRecalcInputQty,
                        ],
                        });
                        // Note: Search.run() is limited to 4,000 results
                        // transactionSearch.run().each((result: search.Result): boolean => {
                        //   return true;
                        // });
                        var transactionSearchPagedData = transactionSearch.runPaged({ pageSize: 1000 });
                        for (var k = 0; k < transactionSearchPagedData.pageRanges.length; k++) {
                            var transactionSearchPage = transactionSearchPagedData.fetch({ index: k });
                            transactionSearchPage.data.forEach(function (result) {
                                var internalId = result.getValue(transactionSearchColInternalId);
                                var productionType = result.getValue(transactionSearchColProductionType);
                                var date = result.getValue(transactionSearchColDate);
                                var assemblyBuildNo = result.getValue(transactionSearchColAssemblyBuildNo);
                                var outputItem = result.getValue(transactionSearchColOutputItem);
                                var type = result.getValue(transactionSearchColType);
                                var units = result.getValue(transactionSearchColUnits);
                                var unitCost = result.getValue(transactionSearchColUnitCost);
                                var qtyProduced = result.getValue(transactionSearchColQtyProduced);
                                var productionAmount = result.getValue(transactionSearchColProductionAmount);
                                var sellingPrice = result.getValue(transactionSearchColSellingPrice);
                                var rbdAvePurchasePrice = result.getValue(transactionSearchColRbdAvePurchasePrice);
                                var factor = result.getValue(transactionSearchColFactor);
                                var qtyfactorformula = result.getValue(transactionSearchColQtyfactorformula);
                                var qtyfactorcustomField = result.getValue(transactionSearchColQtyfactorcustomField);
                                var weightedAve = result.getValue(transactionSearchColWeightedAve);
                                var weightedAvgcustomField = result.getValue(transactionSearchColWeightedAvgcustomField);
                                var totalAmounttodayCustom = result.getValue(transactionSearchColTotalAmounttodayCustom);
                                var newCalculatedCost = result.getValue(transactionSearchColNewCalculatedCost);
                                var averageUnitCost = result.getValue({ name: 'custbody_custom_average_unit_cost' });
                                //var recalcInputQty = result.getValue(transactionSearchColRecalcInputQty);
                                var recalcInputQty = parseFloat(newCalculatedCost) / parseFloat(averageUnitCost);

                                log.debug('internalId',internalId)
                                log.debug('newCalculatedCost',newCalculatedCost)
                                log.debug('averageUnitCost',averageUnitCost)
                                log.debug('recalcInputQty',recalcInputQty)
                               
                                var buildRec = record.load({
                                    type: record.Type.ASSEMBLY_BUILD,
                                    id: internalId,
                                    isDynamic: true,
                                })
                            
                                buildRec.setValue({
                                    fieldId : 'custbody_custom_for_recalc',
                                    value : false
                                })

                                var isRepComponent = buildRec.getValue({
                                    fieldId : 'custbody_store_origcomponent_qty'
                                })

                                var compLineCnt = buildRec.getLineCount({
                                    sublistId: 'component'
                                });
                                log.debug('compLineCnt',compLineCnt)


                                for(var l=0; l<compLineCnt; l++){

                                    var idVal = buildRec.getSublistValue({
                                        sublistId: 'component',
                                        fieldId: 'item',
                                        line: l
                                    });   
                                    log.debug('idVal',idVal)
                                    var qtyVal = buildRec.getSublistValue({
                                        sublistId: 'component',
                                        fieldId: 'quantity',
                                        line: l
                                    });
                                    

                                    if(isRepComponent){
                                        buildRec.selectLine({
                                            sublistId: 'recmachcustrecord6',
                                            line: l
                                        });
    
                                        buildRec.setCurrentSublistValue({
                                            sublistId: 'recmachcustrecord6',
                                            fieldId: 'custrecord_custom_component_item',
                                            value: idVal
                                        });
    
                                        buildRec.setCurrentSublistValue({
                                            sublistId: 'recmachcustrecord6',
                                            fieldId: 'custrecord_custom_component_qty',
                                            value: qtyVal
                                        });
                                      
                                        var transactionSearchColTranDate = search.createColumn({ name: 'trandate', summary: search.Summary.GROUP });
                                        var transactionSearchColTranId = search.createColumn({ name: 'tranid', summary: search.Summary.GROUP });
                                        var transactionSearchColItem = search.createColumn({ name: 'item', summary: search.Summary.GROUP });
                                        var transactionSearchColQuantity = search.createColumn({ name: 'quantity', summary: search.Summary.SUM });
                                        var transactionSearchColAverageUnitCost = search.createColumn({ name: 'rate', summary: search.Summary.SUM });
                                        var transactionSearchColTotalCost = search.createColumn({ name: 'amount', summary: search.Summary.SUM, function: 'absoluteValue' });
                                        
                                        var transactionSearch = search.create({
                                            type: 'transaction',
                                            filters: [
                                                ['type', 'anyof', 'Build'],
                                                'AND',
                                                ['mainline', 'is', 'F'],
                                                'AND',
                                                ['internalid', 'anyof', internalId],
                                                'AND',
                                                ['item', 'anyof', idVal],
                                            ],
                                            columns: [
                                                transactionSearchColTranDate,
                                                transactionSearchColTranId,
                                                transactionSearchColItem,
                                                transactionSearchColQuantity,
                                                transactionSearchColAverageUnitCost,
                                                transactionSearchColTotalCost,
                                            ],
                                        });
                                        
                                        // // Note: Search.run() is limited to 4,000 results
                                        // transactionSearch.run().each((result: search.Result): boolean => {
                                        //     // ...
                                        //
                                        //     return true;
                                        // });
                                        var aveUnitCost;
                                        var transactionSearchPagedData = transactionSearch.runPaged({ pageSize: 1000 });
                                        for (var a = 0; a < transactionSearchPagedData.pageRanges.length; a++) {
                                            var transactionSearchPage = transactionSearchPagedData.fetch({ index: a });
                                            transactionSearchPage.data.forEach(function (result) {
                                                var tranDate = result.getValue(transactionSearchColTranDate);
                                                var tranId = result.getValue(transactionSearchColTranId);
                                                var item = result.getValue(transactionSearchColItem);
                                                var quantity = result.getValue(transactionSearchColQuantity);
                                                var averageUnitCost = result.getValue(transactionSearchColAverageUnitCost);
                                                var totalCost = result.getValue(transactionSearchColTotalCost);
                                                aveUnitCost = averageUnitCost;
                                                // ...
                                            });
                                        }
                                        
                                        buildRec.setCurrentSublistValue({
                                            sublistId: 'recmachcustrecord6',
                                            fieldId: 'custrecord_average_unit_cost',
                                            value: aveUnitCost
                                        });
                                      
                                        buildRec.commitLine({
                                            sublistId: 'recmachcustrecord6'
                                        });
                                    }
                                    
                                    
                                    if(qtyVal > 0){
                                        recalcInputQty = parseFloat(recalcInputQty)
                                        recalcInputQty = recalcInputQty.toFixed(3);
                                        log.debug('recalcInputQty', recalcInputQty)

                                        buildRec.selectLine({
                                            sublistId: 'component',
                                            line: l
                                        });

                                        buildRec.setCurrentSublistValue({
                                            sublistId: 'component',
                                            fieldId: 'quantity',
                                            value: recalcInputQty
                                        });


                                        var itemField = search.lookupFields({
                                            type: search.Type.ITEM,
                                            id: idVal,
                                            columns: ['type']
                                        });

                                        log.debug('itemField',itemField.type)
                                        log.debug('itemField.value',itemField.type[0].value)

                                    /*  buildRec.commitLine({
                                            sublistId: 'component'
                                        });*/

                                        /*buildRec.setSublistValue({
                                            sublistId: 'component',
                                            fieldId: 'quantity',
                                            line: j,
                                            value: recalcInputQty
                                        });*/

                                        if(itemField.type[0].value == 'Assembly'){
                                            var compSubRec = buildRec.getCurrentSublistSubrecord({
                                                sublistId: 'component',
                                                fieldId: 'componentinventorydetail',
                                                line: l
                                            });
    
                                            log.debug('compSubRec',compSubRec)
                                            var itemdetcount = compSubRec.getLineCount({
                                                sublistId: 'inventoryassignment'
                                            });
                                        
    
                                            log.debug('itemdetcount',itemdetcount)
    
                                            for(var z = 0 ; z < itemdetcount; z++){
                                                compSubRec.selectLine({
                                                    sublistId: 'inventoryassignment',
                                                    line: z
                                                });
                        
                                                compSubRec.setCurrentSublistValue({
                                                    sublistId: 'inventoryassignment',
                                                    fieldId: 'quantity',
                                                    value: recalcInputQty
                                                });
                                                
                                                compSubRec.commitLine({
                                                    sublistId: 'inventoryassignment'
                                                });
    
                                                /*compSubRec.setSublistValue({
                                                    sublistId: 'inventoryassignment',
                                                    fieldId: 'quantity',
                                                    value: recalcInputQty,
                                                    line: z
                                                });*/
    
                                                var afterSettingStatus = compSubRec.getSublistValue({
                                                    sublistId: 'inventoryassignment',
                                                    fieldId: 'quantity',
                                                    line:z
                                                });
    
                                                log.debug('afterSettingStatus',afterSettingStatus)
                                            }
                                        }
                                        
                                        buildRec.commitLine({
                                            sublistId: 'component'
                                        });
                                    }
                                
                                }

                                buildRec.setValue({
                                    fieldId : 'custbody_store_origcomponent_qty',
                                    value : false
                                })

                            
                                try {
                                var buildId = buildRec.save({
                                    enableSourcing: true,
                                    ignoreMandatoryFields: true
                                });

                                log.debug('buildId',buildId)
                                }
                                catch (e){
                                    log.error({
                                        title: e.name,
                                        details: 'Error processing record with internal ID: ' + internalId + '. ' + e.message
                                    });
                                }
                                // return true;
                            });
                        }
                    }); 
                }
            });
        }  
        log.debug('Scheduled Script End', 'Scheduled Script Execution Completed');
   }

    return {
        execute: execute
    };
    
});