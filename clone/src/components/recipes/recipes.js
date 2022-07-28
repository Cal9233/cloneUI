import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Animations from '../animations/animations';
import { Controller } from "react-hook-form";
import { Fragment } from 'react';
import BaseSelect from "react-select";
import RequiredSelect from '../mainpage/requiredselect';
import { useDispatch, useSelector } from "react-redux";
import { getSequencingRecipesAll, getAnalysisRecipesAll, getSequencingRecipesActiveNotUsed, getAnalysisRecipesActiveNotUsed, getSequencingRecipesAllWithTs, getAnalysisRecipesAllWithTs } from "../actions/index";

const Recipes = props => {
    const { sequencingRecipe, analysisRecipe, onSequencingRecipeSelect, onAnalysisRecipeSelect, methods, preAmpReagentsChange, preAmpReagents, isPreAmpDisabled,
        isAnalysisRecipeDisabled, isSequencingRecipeDisabled} = props;
    const [selectedOptionSR, setSelectedOptionSR] = useState(sequencingRecipe);
    const [selectedOptionAR, setSelectedOptionAR] = useState(analysisRecipe);

    const state = useSelector(state => state);
    const sequencingRecipesRemote = useSelector(state => state.sequencingRecipes);
    const analysisRecipesRemote = useSelector(state => state.analysisRecipes);
    const dispatch = useDispatch();

    useEffect(() => {
        if (state.tabs.activeTab === '1') {
            dispatch(getSequencingRecipesActiveNotUsed());  
            dispatch(getAnalysisRecipesActiveNotUsed());            
        }   
        else if (state.tabs.activeTab === '2') {
            //dispatch(getSequencingRecipesAll());  
            //dispatch(getAnalysisRecipesAll());

            dispatch(getSequencingRecipesActiveNotUsed());  
            dispatch(getAnalysisRecipesActiveNotUsed()); 
            //dispatch(getSequencingRecipesAllWithTs());  
            //dispatch(getAnalysisRecipesAllWithTs());      
        }      
    }, [state.tabs.activeTab]);

    useEffect(() => {
        setSelectedOptionSR('');
    }, [isSequencingRecipeDisabled]);

    useEffect(() => {        
        setSelectedOptionAR('');   
    }, [isAnalysisRecipeDisabled]);

    const handleSequencingRecipeSelect = (e) => {
        setSelectedOptionSR(e.value);
        onSequencingRecipeSelect(e.value);        
    };

    const handleAnalysisRecipeSelect = (e) => {
        setSelectedOptionAR(e.value);
        onAnalysisRecipeSelect(e.value);
    };

    const handlePreAmpReagentsChange = (data) => {
        preAmpReagentsChange(data.target.value);
    };

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            marginTop: 15,
        },
        label: {
            marginLeft: 5,
            textAlign: 'left !important',
        },
        label_warning: {
            marginLeft: 5,
            textAlign: 'left !important',
            outline: 'none !important',
            border: '1px solid red',
            boxShadow: '0 0 10px #719ECE',
        }
    }));

    const classes = useStyles();
	
    const SeqRecipeOptions = sequencingRecipesRemote != undefined && sequencingRecipesRemote.length != 0 ? sequencingRecipesRemote.map((e, i) => ({ 'value': e.Id, 'label': e.Name })) : [];    
    const AnalysisRecipeOptions = analysisRecipesRemote != undefined && analysisRecipesRemote.length != 0 ? analysisRecipesRemote.map((e, i) => ({ 'value': e.Id, 'label': e.Name })) : [];    

    const customStyles = {
        // For the select it self, not the options of the select
        control: (styles, { isDisabled}) => {
          return {
            ...styles,
            cursor: isDisabled ? 'not-allowed' : 'default',
            backgroundColor: isDisabled ? '#e9ecef' : 'white',
            color: isDisabled ? '#aaa' : 'white'
          }
        },

        // For the options
        /*option: (styles, { isDisabled}) => {          
          return {
            ...styles,           
            color: 'red',           
          };
        },*/

        singleValue: (provided, state) => {
            const color = 'black';
            return { ...provided, color };
        },

        /*placeholder: (provided, state) => {
            const color = 'black';
            return { ...provided, color };
        }*/
      };

    const SRSelect = () => {
        return (
            <Fragment>
                <Select
                    isDisabled={isSequencingRecipeDisabled}
                    options={/*sequencingRecipesRemote.length != 0 && */SeqRecipeOptions}
                    onChange={handleSequencingRecipeSelect}
                    value={selectedOptionSR == '' ? SeqRecipeOptions.filter(option => {
                        return option.value === sequencingRecipe.Id != undefined ? sequencingRecipe.Id : sequencingRecipe;
                    }) : selectedOptionSR.Id == sequencingRecipe.Id ? SeqRecipeOptions.filter(option => {
                        return option.value === selectedOptionSR;
                    }) : SeqRecipeOptions.filter(option => {
                        return option.value === sequencingRecipe.Id != undefined ? sequencingRecipe.Id : sequencingRecipe;
                    })}
                    label="Select Recipe:"    
                    required={true}    
                    styles={customStyles}            
                />               
            </Fragment>
        );
    }

    const ARSelect = () => {
        return (
            <Fragment>
                <Select
                    isDisabled={isAnalysisRecipeDisabled}
                    options={/*analysisRecipesRemote.length != 0 && */AnalysisRecipeOptions}
                    onChange={handleAnalysisRecipeSelect}
                    value={selectedOptionAR == '' ? AnalysisRecipeOptions.filter(option => {
                        return option.value === analysisRecipe.Id;
                    }) : selectedOptionAR.Id == analysisRecipe.Id ? AnalysisRecipeOptions.filter(option => {
                        return option.value === selectedOptionAR;
                    }) : AnalysisRecipeOptions.filter(option => {
                        return option.value === analysisRecipe.Id;
                    })}
                    label="Select Recipe:"
                    required={true}
                    styles={customStyles}
                />               
            </Fragment>
        );
    }

    const Select = props => (
        <RequiredSelect
          {...props}
          SelectComponent={BaseSelect}
          options={props.options}
          styles={customStyles}
        />
      );

      const ref = React.createRef();

    return (
        <React.Fragment>
            <div className="form-group text-left" style={{ maxWidth: '490px' }}>
                <label htmlFor="btnGrp2" className={classes.label}>Sequencing Recipe</label>
                {sequencingRecipe == '' ?
                    /*<Controller
                        as={<SRSelect />}                        
                        name="SRDropDown"
                        rules={{ required: "this is required" }}
                        //defaultValue=''
                        control={methods.control}
                    />*/
                    <SRSelect /> :
                    <Select
                        options={/*sequencingRecipesRemote.length != 0 && */SeqRecipeOptions}
                        onChange={handleSequencingRecipeSelect}
                        value={selectedOptionSR == '' ? SeqRecipeOptions.filter(option => {
                            return option.value === sequencingRecipe.Id;
                        }) : selectedOptionSR.Id == sequencingRecipe.Id ? SeqRecipeOptions.filter(option => {
                            return option.value === selectedOptionSR;
                        }) : SeqRecipeOptions.filter(option => {
                            return option.value === sequencingRecipe.Id;
                        })}
                        label="Select Recipe:"
                        required={true}
                        defaultValue=''   
                        isDisabled={isSequencingRecipeDisabled}  
                        styles={customStyles}                   
                    />
                }
            </div>
            <div className="form-group text-left" style={{ maxWidth: '490px', }}>
                <label htmlFor="btnGrp2" className={classes.label}>Analysis Recipe</label>
                {analysisRecipe == '' ?
                    /*<Controller
                        as={ARSelect}
                        name="ARDropDown"
                        rules={{ required: "this is required" }}
                        defaultValue=''
                        control={methods.control}
                    />*/
                    <ARSelect /> :
                    <Select
                        options={/*analysisRecipesRemote.length != 0 && */AnalysisRecipeOptions}
                        onChange={handleAnalysisRecipeSelect}
                        value={selectedOptionAR == '' ? AnalysisRecipeOptions.filter(option => {
                            return option.value === analysisRecipe.Id;
                        }) : selectedOptionAR.Id == analysisRecipe.Id ? AnalysisRecipeOptions.filter(option => {
                            return option.value === selectedOptionAR;
                        }) : AnalysisRecipeOptions.filter(option => {
                            return option.value === analysisRecipe.Id;
                        })}
                        label="Select Recipe:"
                        required={true}
                        defaultValue=''
                        isDisabled={isAnalysisRecipeDisabled}
                        styles={customStyles}
                    />}
            </div>
            <div className="form-group text-left" style={{ maxWidth: '490px' }}>
                <label htmlFor="preAmpReagents">Pre-Amp Reagents (Optional):</label>
                <div className="input-group mb-3">
                    <input type="text" disabled={isPreAmpDisabled} ref={methods.register()} onChange={handlePreAmpReagentsChange} value={preAmpReagents == null ? '' : preAmpReagents} name="preAmpReagents" id='preAmpReagents' className="form-control" />
                </div>
            </div>
        </React.Fragment>
    )
}

export default Recipes;