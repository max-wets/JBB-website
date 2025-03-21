import classes from './CustomSearchBox.module.css';
import { connectSearchBox } from 'react-instantsearch-dom';
import { InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

function SearchBox({ refine }) {
  return (
    <div className={classes.searchbox}>
      <form
        noValidate
        className={classes.searchboxform}
        action=""
        role="search"
      >
        <InputGroup display="flex" alignItems="center" justifyContent="center">
          <InputLeftElement
            pointerEvents="none"
            // eslint-disable-next-line react/no-children-prop
            children={<SearchIcon color="red.200" />}
            ml={4}
            mt={2}
            mb={2}
          />
          <input
            className={classes.searchboxinput}
            type="search"
            placeholder="Chercher un article..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            required
            maxLength={400}
            onChange={(e) => refine(e.currentTarget.value)}
          />
        </InputGroup>
      </form>
    </div>
  );
}

export default connectSearchBox(SearchBox);
